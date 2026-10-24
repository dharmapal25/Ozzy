import { useState } from "react";
import JSZip from "jszip";

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

const useDownload = (onError) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadFile = (file) => {
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

  const downloadZip = async (files) => {
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

      downloadBlob(await zip.generateAsync({ type: "blob" }), "generated-files.zip");
    } catch (downloadError) {
      onError(downloadError.message || "Could not create the ZIP file.");
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadFile, downloadZip, isDownloading };
};

export default useDownload;
