import { useState } from "react";
import JSZip from "jszip";
import { FiArchive, FiDownload, FiFileText } from "react-icons/fi";

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

const getFileTitle = (filename) => {
  const basename = filename.split(/[\\/]/).pop() || filename;
  const extensionIndex = basename.lastIndexOf(".");
  return extensionIndex > 0 ? basename.slice(0, extensionIndex) : basename;
};

const getFileType = (filename) => {
  const extension = filename.split(".").pop();
  return extension && extension !== filename
    ? `Code · ${extension.toUpperCase()}`
    : "Generated file";
};

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

const GeneratedFileCard = ({ file, onError }) => {
  const downloadFile = () => {
    try {
      const filename = normalizeFilename(file.filename);
      if (!filename) throw new Error("The generated file has an invalid name.");
      downloadBlob(
        new Blob([file.content], { type: "text/plain;charset=utf-8" }),
        filename.split("/").pop()
      );
    } catch (downloadError) {
      onError(downloadError.message || "Could not download the generated file.");
    }
  };

  return (
    <div className="generated-file-card">
      <span className="generated-file-icon" aria-hidden="true"><FiFileText /></span>
      <span className="generated-file-details">
        <span className="generated-file-title" title={file.filename}>{getFileTitle(file.filename)}</span>
        <span className="generated-file-type">{getFileType(file.filename)}</span>
      </span>
      <button type="button" className="generated-file-download" onClick={downloadFile}>
        <FiDownload aria-hidden="true" />
        Download
      </button>
    </div>
  );
};

const GeneratedFiles = ({ content, onError }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const files = extractGeneratedFiles(content);
  const includeZipDownload = content?.includes(zipDownloadMarker);

  const downloadZip = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      const usedNames = new Set();

      files.forEach((file) => {
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
        zip.file(uniqueFilename, file.content);
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
      {files.map((file, index) => (
        <GeneratedFileCard key={`${file.filename}-${index}`} file={file} onError={onError} />
      ))}
      {includeZipDownload && (
        <button
          type="button"
          className="generated-files-zip"
          onClick={downloadZip}
          disabled={isDownloading}
        >
          <FiArchive aria-hidden="true" />
          {isDownloading ? "Creating ZIP..." : "Download ZIP"}
        </button>
      )}
    </div>
  );
};

export default GeneratedFiles;
