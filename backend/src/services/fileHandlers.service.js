import path from "path";
import unzipper from "unzipper";
import { PDFParse } from "pdf-parse";

import mammoth from "mammoth";
import * as XLSX from "xlsx";
import { gemini } from "../config/gemini.config.js";


// Analyze images
export const explainImageWithAI = async (buffer, mimeType, filename, note = "") => {
  try {
    const base64Data = buffer.toString("base64");
    const response = await gemini.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType || "image/png",
              },
            },
            {
              text: `File: ${filename}. ${note}
              Analyze this image thoroughly. Describe architecture flow, UI components, text, diagrams, or database relations clearly so it can be indexed for developer code search.`,
            },
          ],
        },
      ],
    });
    return response.text || `Visual asset: ${filename}`;


  } catch (error) {
    console.error(`AI Vision failed on ${filename}:`, error.message);

    return `Visual asset named ${filename} (Description unavailable)`;
  }
};



// Code & Plain Text Files Handler
export const handleCodeFile = (file, fileLocation) => {
  const ext = path.extname(file.originalname).replace(".", "").toLowerCase();
  return {
    filename: file.originalname,
    filetype: ext,
    FileLocation: fileLocation || file.originalname,
    info: file.buffer.toString("utf-8"),
  };
};

// Standalone Images Handler (PNG, JPG, JPEG, WEBP, SVG)
export const handleImageFile = async (file, fileLocation) => {
  const ext = path.extname(file.originalname).replace(".", "").toLowerCase();
  const mime = file.mimetype || `image/${ext === "jpg" ? "jpeg" : ext}`;

  const description = await explainImageWithAI(
    file.buffer,
    mime,
    file.originalname,
    "Standalone visual asset in project."
  );

  return {
    filename: file.originalname,
    filetype: ext,
    FileLocation: fileLocation || file.originalname,
    info: `[IMAGE ASSET: ${file.originalname}]\nPath: ${fileLocation}\nDescription:\n${description}`,
  };
};

// 3. PDF Handler (With Internal Image/Diagram Detection + AI Vision)
export const handlePdfFile = async (file, fileLocation) => {
  const parser = new PDFParse({ data: file.buffer });
  let pdfData;
  try {
    pdfData = await parser.getText();
  } finally {
    await parser.destroy();
  }
  let combinedContent = pdfData.text || "";


  // PDF buffer
  const rawString = file.buffer.toString("latin1");
  const hasImages = rawString.includes("/Subtype/Image") || rawString.includes("/Subtype /Image");

  if (hasImages) {
    const visualExplanation = await explainImageWithAI(
      file.buffer,
      "application/pdf",
      file.originalname,
      "PDF contains embedded diagrams, flowcharts or scanned content."
    );
    combinedContent += `\n\n[PDF EMBEDDED DIAGRAMS/VISUAL EXPLANATION]\n${visualExplanation}`;
  }

  return {
    filename: file.originalname,
    filetype: "pdf",
    FileLocation: fileLocation || file.originalname,
    info: combinedContent,
  };
};

// Office Files Handler (.docx, .xlsx, .csv)
export const handleOfficeFile = async (file, fileLocation) => {
  const ext = path.extname(file.originalname).replace(".", "").toLowerCase();
  let extractedRawText = "";

  if (ext === "docx" || ext === "doc") {
    const res = await mammoth.extractRawText({ buffer: file.buffer });
    extractedRawText = res.value;

  } else if (ext === "xlsx" || ext === "xls" || ext === "csv") {
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    extractedRawText = workbook.SheetNames.map(
      (name) => `Sheet: ${name}\n` + XLSX.utils.sheet_to_csv(workbook.Sheets[name])
    ).join("\n\n");

  } else {
    extractedRawText = file.buffer.toString("utf-8");
  }


  let finalOfficeText = extractedRawText;
  try {
    const response = await gemini.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `File: ${file.originalname} (Type: ${ext})\nRaw Content:\n${extractedRawText.slice(0, 7000)}\n\nFormat and summarize this office document structure clearly for semantic search:`,
    });
    finalOfficeText = response.text || extractedRawText;
  } catch (err) {
    console.error(`Office AI formatting skipped for ${file.originalname}`);
  }

  return {
    filename: file.originalname,
    filetype: ext,
    FileLocation: fileLocation || file.originalname,
    info: `[OFFICE DOCUMENT: ${file.originalname}]\nType: ${ext}\nContent Summary:\n${finalOfficeText}`,
  };
};

// ZIP Archive Handler (Nested Items processing with respective Handlers)
export const handleZipFile = async (file) => {
  const directory = await unzipper.Open.buffer(file.buffer);
  const zipResults = [];

  const ignoredFolders = ["node_modules", ".git", "__MACOSX", ".DS_Store", "dist", "build", "package-lock.json", "yarn.lock"];
  const codeExts = new Set(["js", "jsx", "ts", "tsx", "json", "html", "css", "py", "java", "cpp", "c", "txt", "md", "env", "sh", "bat", "ps1"]);
  const imageExts = new Set(["png", "jpg", "jpeg", "webp", "svg"]);
  const officeExts = new Set(["docx", "doc", "xlsx", "xls", "csv", "pptx"]);


  for (const entry of directory.files) {
    if (entry.type === "Directory") continue;
    const entryPath = entry.path;

    if (ignoredFolders.some((f) => entryPath.includes(f))) continue;

    const ext = path.extname(entryPath).toLowerCase().replace(".", "");

    // Skip GIF and Media inside ZIP
    if (["gif", "mp3", "wav", "mp4", "mkv", "avi"].includes(ext)) continue;

    const buffer = await entry.buffer();
    const fakeFile = {
      originalname: path.basename(entryPath),
      mimetype: "",
      buffer,
    };

    if (codeExts.has(ext)) {
      zipResults.push(handleCodeFile(fakeFile, entryPath));
    }

    else if (imageExts.has(ext)) {
      fakeFile.mimetype = `image/${ext === "jpg" ? "jpeg" : ext}`;
      const imgRes = await handleImageFile(fakeFile, entryPath);
      zipResults.push(imgRes);
    }

    else if (ext === "pdf") {
      fakeFile.mimetype = "application/pdf";
      const pdfRes = await handlePdfFile(fakeFile, entryPath);
      zipResults.push(pdfRes);
    }

    else if (officeExts.has(ext)) {
      const officeRes = await handleOfficeFile(fakeFile, entryPath);
      zipResults.push(officeRes);
    }

  }

  return zipResults;
};