import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiDownload, FiX } from "react-icons/fi";

const CodeEditor = ({ file, onChange, onClose, onDownload }) => {
  const filename = file.filename.split(/[\\/]/).pop() || file.filename;
  const [workspaceBounds, setWorkspaceBounds] = useState(null);

  useLayoutEffect(() => {
    const workspaceBody = document.querySelector(".workspace-body");
    if (!workspaceBody) return undefined;

    const updateBounds = () => {
      const { left, width } = workspaceBody.getBoundingClientRect();
      setWorkspaceBounds({ left, width });
    };

    workspaceBody.classList.add("file-editor-open");
    updateBounds();
    const observer = new ResizeObserver(updateBounds);
    observer.observe(workspaceBody);
    window.addEventListener("resize", updateBounds);

    return () => {
      workspaceBody.classList.remove("file-editor-open");
      observer.disconnect();
      window.removeEventListener("resize", updateBounds);
    };
  }, []);

  return createPortal(
    <>
      <aside
        className="generated-file-editor"
        role="dialog"
        aria-label={`Edit ${filename}`}
        style={workspaceBounds ? {
          left: `${workspaceBounds.left + workspaceBounds.width / 2}px`,
          width: `${workspaceBounds.width / 2}px`,
        } : undefined}
      >
        <header className="generated-file-editor-header">
          <div className="generated-file-editor-heading">
            <strong className="generated-file-editor-name" title={filename}>{filename}</strong>
            <span>Edit generated file</span>
          </div>
          <button
            type="button"
            className="generated-file-editor-close"
            onClick={onClose}
            aria-label="Close editor"
            title="Close editor"
          >
            <FiX />
          </button>
        </header>
        <textarea
          className="generated-file-editor-textarea"
          aria-label={`Contents of ${filename}`}
          spellCheck="false"
          value={file.content}
          onChange={(event) => onChange(event.target.value)}
        />
        <footer className="generated-file-editor-footer">
          <button
            type="button"
            className="generated-file-editor-download"
            onClick={onDownload}
          >
            <FiDownload aria-hidden="true" />
            Download edited file
          </button>
        </footer>
      </aside>
    </>,
    document.body
  );
};

export default CodeEditor;