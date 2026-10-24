import { useState } from "react";
import JSZip from "jszip";
import { FiDownload } from "react-icons/fi";
import CodeEditor from "./CodeEditor";

const generatedFilePattern = /```file:([^\s`]+)\s*\r?\n([\s\S]*?)```/g;
const zipDownloadMarker = "[[download-generated-files-zip]]";

const extractGeneratedFiles = (content) => {
  if (typeof content !== "string") return [];

  return Array.from(content.matchAll(generatedFilePattern), (match) => ({
    filename: match[1],
    content: match[2].replace(/\r?\n$/, ""),
  }));
};

const normalizeFilename = (filename) => filename
  .replace(/\\/g, "/")
  .split("/")
  .filter((part) => part && part !== "." && part !== "..")
  .map((part) => part.replace(/[<>:"|?*]/g, "_"))
  .join("/");

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const downloadFile = (file, onError) => {
  try {
    const filename = normalizeFilename(file.filename).split("/").pop();
    if (!filename) throw new Error("The generated file has an invalid name.");
    downloadBlob(
      new Blob([file.content], { type: "text/plain;charset=utf-8" }),
      filename
    );
  } catch (downloadError) {
    onError(downloadError.message || "Could not download the generated file.");
  }
};

const GeneratedFiles = ({ content, onError }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);
  const [editedFiles, setEditedFiles] = useState({});
  const files = extractGeneratedFiles(content);
  const selectedFile = files[selectedFileIndex];
  const selectedFileKey = selectedFile ? `${selectedFile.filename}-${selectedFileIndex}` : null;
  const getFileContent = (file, index) => editedFiles[`${file.filename}-${index}`] ?? file.content;

  const downloadZip = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      const usedNames = new Set();

      files.forEach((file, index) => {
        const filename = normalizeFilename(file.filename);
        if (!filename) throw new Error("A generated file has an invalid name.");

        let uniqueFilename = filename;
        let suffix = 1;
        while (usedNames.has(uniqueFilename)) {
          const extensionIndex = filename.lastIndexOf(".");
          const base = extensionIndex > 0 ? filename.slice(0, extensionIndex) : filename;
          const extension = extensionIndex > 0 ? filename.slice(extensionIndex) : "";
          uniqueFilename = `${base}-${suffix}${extension}`;
          suffix += 1;
        }
        usedNames.add(uniqueFilename);
        zip.file(uniqueFilename, editedFiles[`${file.filename}-${index}`] ?? file.content);
      });

      const blob = await zip.generateAsync({ type: "blob" });
      downloadBlob(blob, "generated-files.zip");
    } catch (downloadError) {
      onError(downloadError.message || "Could not create the ZIP file.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (files.length === 0) return null;

  return (
    <div className="generated-files">
      {files.map((file, index) => {
        const currentFile = { ...file, content: getFileContent(file, index) };
        const filename = file.filename.split(/[\\/]/).pop() || file.filename;

        return (
          <div className="generated-file-card" key={`${file.filename}-${index}`}>
            <button
              type="button"
              className="generated-file-open"
              onClick={() => setSelectedFileIndex(index)}
              title={`Edit ${filename}`}
            >
              {filename}
            </button>
            <button
              type="button"
              className="generated-file-download"
              onClick={() => downloadFile(currentFile, onError)}
              aria-label={`Download ${filename}`}
              title="Download"
            >
              <FiDownload aria-hidden="true" />
            </button>
          </div>
        );
      })}
      {content?.includes(zipDownloadMarker) && (
        <button
          type="button"
          className="generated-files-zip"
          onClick={downloadZip}
          disabled={isDownloading}
        >
          {isDownloading ? "Preparing ZIP..." : "Download ZIP"}
        </button>
      )}
      {selectedFile && (
        <CodeEditor
          file={{ ...selectedFile, content: getFileContent(selectedFile, selectedFileIndex) }}
          onChange={(content) => setEditedFiles((current) => ({ ...current, [selectedFileKey]: content }))}
          onClose={() => setSelectedFileIndex(null)}
          onDownload={() => downloadFile({
            ...selectedFile,
            content: getFileContent(selectedFile, selectedFileIndex),
          }, onError)}
        />
      )}
    </div>
  );
};

export default GeneratedFiles;
