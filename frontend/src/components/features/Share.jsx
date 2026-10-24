import { useState } from "react";
import { FiX } from "react-icons/fi";

const Share = ({ onClose }) => {
  const [copyStatus, setCopyStatus] = useState("");
  const currentUrl = window.location.href;

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopyStatus("Link copied");
    } catch (error) {
      console.error("Could not copy share link:", error);
      setCopyStatus("Could not copy link. Please copy the URL manually.");
    }
  };

  return (
    <div
      className="share-modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="share-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
      >
        <header className="share-modal-header">
          <h2 id="share-modal-title">Share this work</h2>
          <button
            type="button"
            className="share-modal-close"
            onClick={onClose}
            aria-label="Close share dialog"
          >
            <FiX />
          </button>
        </header>
        <div className="share-link-row">
          <input type="text" value={currentUrl} readOnly aria-label="Current page URL" />
          <button type="button" className="share-copy-btn" onClick={copyUrl}>
            Copy
          </button>
        </div>
        {copyStatus && (
          <p className="share-copy-status" role="status">{copyStatus}</p>
        )}
      </section>
    </div>
  );
};

export default Share;