import path from "path";
import {
    handleCodeFile,
    handleImageFile,
    handlePdfFile,
    handleOfficeFile,
    handleZipFile,
} from "./fileHandlers.service.js";

const CODE_EXTS = new Set(["js", "jsx", "ts", "tsx", "json", "html", "css", "py", "java", "cpp", "c", "txt", "md", "env"]);
const IMAGE_EXTS = new Set(["png", "jpg", "jpeg", "webp", "svg"]);
const OFFICE_EXTS = new Set(["docx", "doc", "xlsx", "xls", "csv", "pptx"]);

export const aggregateAllUploadedFiles = async (files = [], relativePaths = {}) => {
    const allProcessedFiles = [];

    
    for (const file of files) {
        const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
        const mime = (file.mimetype || "").toLowerCase();
        const fileLocation = file.relativePath || relativePaths[file.originalname] || file.originalname;


        // Media and GIF ignore 
        if (ext === "gif" || mime.includes("gif") || mime.startsWith("audio/")
            || mime.startsWith("video/")
            || ["mp3", "wav", "mp4", "mkv", "avi", "mov"].includes(ext)) {

            console.log(`[IGNORED MEDIA/GIF]: ${file.originalname}`);
            continue;

        }

        // ZIP Archive
        if (ext === "zip" || mime.includes("zip")) {
            const zipExtracted = await handleZipFile(file);
            allProcessedFiles.push(...zipExtracted);
        }

        // PDF Files
        else if (ext === "pdf" || mime.includes("pdf")) {
            const pdfData = await handlePdfFile(file, fileLocation);
            allProcessedFiles.push(pdfData);
        }

        // Image Files
        else if (IMAGE_EXTS.has(ext) || mime.startsWith("image/")) {
            const imgData = await handleImageFile(file, fileLocation);
            allProcessedFiles.push(imgData);
        }

        // Office Files
        else if (OFFICE_EXTS.has(ext) || mime.includes("officedocument") || mime.includes("msword")) {
            const officeData = await handleOfficeFile(file, fileLocation);
            allProcessedFiles.push(officeData);
        }

        // Code & Text Files
        else if (CODE_EXTS.has(ext) || mime.startsWith("text/")) {
            const codeData = handleCodeFile(file, fileLocation);
            allProcessedFiles.push(codeData);
        }
    }

    return allProcessedFiles;
};