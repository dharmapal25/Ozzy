import { useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

const WorkspaceToolPanel = ({ title, children, onClose }) => {
  useLayoutEffect(() => {
    const workspaceBody = document.querySelector(".workspace-body");
    workspaceBody?.classList.add("file-editor-open");

    return () => {
      workspaceBody?.classList.remove("file-editor-open");
    };
  }, []);

  return createPortal(
    <aside className="workspace-tool-panel">
      <header className="generated-file-editor-header">
        <strong className="generated-file-editor-name">{title}</strong>
        <button
          type="button"
          className="generated-file-editor-close"
          onClick={onClose}
          aria-label={`Close ${title}`}
        >
          <FiX aria-hidden="true" />
        </button>
      </header>
      <div className="workspace-tool-panel-content">{children}</div>
    </aside>,
    document.body
  );
};

export default WorkspaceToolPanel;
