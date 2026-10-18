import React from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { IoMic } from "react-icons/io5";
import { RiSendPlaneFill } from "react-icons/ri";
import { useInput } from "../context/inputContext";

const Input = ({ onSendMessage, isLoading = false }) => {

  const { text, setText, files, setFiles } = useInput();

  const submitMessage = () => {
    const message = text.trim();
    if (!message || isLoading) return;

    setText("");
    onSendMessage(message, files);
    setFiles([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles((currentFiles) => {
        const selectedFiles = Array.from(e.target.files);
        const knownNames = new Set(currentFiles.map((file) => `${file.name}:${file.size}:${file.lastModified}`));
        return [
          ...currentFiles,
          ...selectedFiles.filter((file) => !knownNames.has(`${file.name}:${file.size}:${file.lastModified}`)),
        ];
      });
      e.target.value = "";
    }
  };

  const removeFile = (fileToRemove) => {
    setFiles((currentFiles) => currentFiles.filter((file) => file !== fileToRemove));
  };

  return (
    <div className="input-dock-content">
      {
        files.length > 0 && (
          <div className="selected-files" aria-label="Selected files">


            {

              files.map((file) => (
                <span className="selected-file" key={`${file.name}:${file.size}:${file.lastModified}`}>
                  <span className="selected-file-name" title={file.name}>{file.name}</span>

                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={() => removeFile(file)}
                    aria-label={`Remove ${file.name}`}
                    title={`Remove ${file.name}`}
                  >
                    <FiX />
                  </button>

                </span>
              ))

            }


          </div>
        )}

      <div className="work-input-container">
        <label className="input-action-btn file-label" title="Upload files">
          <FiPlus />
          <input
            type="file"
            multiple
            accept=".txt,.md,.markdown,.json,.js,.jsx,.ts,.tsx,.py,.java,.c,.h,.cpp,.css,.html,.xml,.yaml,.yml,.csv,.sql,.log"
            style={{ display: "none" }}
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </label>

        <input
          type="text"
          className="prompt-input"
          placeholder="Ask something uploaded docs related..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />

        <div className="input-actions-right">
          <button type="button" className="icon-btn-secondary" title="Mic" disabled>
            <IoMic />
          </button>
          <button
            type="button"
            className="submit-btn"
            onClick={submitMessage}
            disabled={isLoading || !text.trim()}
            title="Send prompt"
          >
            {isLoading ? "…" : <RiSendPlaneFill />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Input;