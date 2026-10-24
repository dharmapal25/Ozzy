import { useState } from "react";
import { FiDownload } from "react-icons/fi";
import CodeEditor from "./CodeEdit";
import useDownload from "../../hooks/useDownload";

const generatedFilePattern = /```file:([^\s`]+)\s*\r?\n([\s\S]*?)```/g;
const zipDownloadMarker = "[[download-generated-files-zip]]";

const extractGeneratedFiles = (content) => {
  if (typeof content !== "string") return [];

  return Array.from(content.matchAll(generatedFilePattern), (match) => ({
    filename: match[1],
    content: match[2].replace(/\r?\n$/, ""),
  }));
};

const GeneratedFiles = ({ content, onError }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);
  const [editedFiles, setEditedFiles] = useState({});
  const { downloadFile, downloadZip, isDownloading } = useDownload(onError);
  const files = extractGeneratedFiles(content);
  const selectedFile = files[selectedFileIndex];
  const selectedFileKey = selectedFile ? `${selectedFile.filename}-${selectedFileIndex}` : null;
  const getFileContent = (file, index) => editedFiles[`${file.filename}-${index}`] ?? file.content;

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
              onClick={() => downloadFile(currentFile)}
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
          onClick={() => downloadZip(files.map((file, index) => ({
            ...file,
            content: getFileContent(file, index),
          })))}
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
          onError={onError}
          onDownload={() => downloadFile({
            ...selectedFile,
            content: getFileContent(selectedFile, selectedFileIndex),
          })}
        />
      )}
    </div>
  );
};

export default GeneratedFiles;
