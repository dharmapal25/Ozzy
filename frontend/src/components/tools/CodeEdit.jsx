import { useState } from "react";
import { FiDownload } from "react-icons/fi";
import useDownload from "../../hooks/useDownload";
import WorkspaceToolPanel from "./WorkspaceToolPanel";

const CodeEditor = ({ file = { filename: "untitled.js", content: "" }, onChange, onClose, onDownload, onError }) => {
  const filename = file.filename.split(/[\\/]/).pop() || file.filename;
  const [draftContent, setDraftContent] = useState("");
  const content = onChange ? file.content : draftContent;
  const { downloadFile: downloadGeneratedFile } = useDownload(onError);

  return (
    <WorkspaceToolPanel title={filename} onClose={onClose}>
      <textarea
        className="generated-file-editor-textarea"
        aria-label={`Contents of ${filename}`}
        spellCheck="false"
        value={content}
        onChange={(event) => {
          if (onChange) onChange(event.target.value);
          else setDraftContent(event.target.value);
        }}
      />
      <footer className="generated-file-editor-footer">
        <button
          type="button"
          className="generated-file-editor-download"
          onClick={() => {
            if (onDownload) onDownload();
            else downloadGeneratedFile({ filename, content });
          }}
        >
          <FiDownload aria-hidden="true" />
          Download edited file
        </button>
      </footer>
    </WorkspaceToolPanel>
  );
};

export default CodeEditor;