import { useEffect, useRef, useState } from "react";
import { FiArrowUp, FiPlus, FiX } from "react-icons/fi";
import { useInput } from "../context/inputContext";
import { LoadingContent } from "../components/UI/LoadingComponent";
import SpeechToText from "../components/SpeechToText";

const Input = ({ onSendMessage, isLoading = false }) => {

  const { text, setText, files, setFiles } = useInput();
  const [isUploadMenuOpen, setIsUploadMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const messageInputRef = useRef(null);
  const fileTypes = ".txt,.md,.markdown,.json,.js,.jsx,.ts,.tsx,.py,.java,.c,.h,.cpp,.css,.html,.xml,.yaml,.yml,.csv,.sql,.log,.zip,.pdf,.doc,.docx,.xls,.xlsx,.pptx,.png,.jpg,.jpeg,.webp,.svg";

  useEffect(() => {
    if (!messageInputRef.current) return;
    messageInputRef.current.style.height = "auto";
    messageInputRef.current.style.height = `${Math.min(messageInputRef.current.scrollHeight, 160)}px`;
  }, [text]);

  const getFilePath = (file) => file.relativePath || file.webkitRelativePath || file.name;

  const addFiles = (selectedFiles) => {
    setFiles((currentFiles) => {
      const knownNames = new Set(currentFiles.map((file) => `${getFilePath(file)}:${file.size}:${file.lastModified}`));
      return [
        ...currentFiles,
        ...selectedFiles.filter((file) => !knownNames.has(`${getFilePath(file)}:${file.size}:${file.lastModified}`)),
      ];
    });
  };

  const submitMessage = () => {
    const message = text.trim();
    if (!message || isLoading) return;

    setText("");
    if (messageInputRef.current) messageInputRef.current.style.height = "";
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
      addFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const removeFile = (fileToRemove) => {
    setFiles((currentFiles) => currentFiles.filter((file) => file !== fileToRemove));
  };

  return (
    <div className="input-dock-content">
      <div className="work-input-container">
        <textarea
          ref={messageInputRef}
          className="prompt-input"
          placeholder="Send a message..."
          value={text}
          rows={1}
          onChange={(e) => {
            setText(e.target.value);
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = `${Math.min(e.currentTarget.scrollHeight, 160)}px`;
          }}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />

        <div className="input-toolbar">
          <div className="input-toolbar-left">
            <div className="upload-picker">
              <button
                type="button"
                className="file-label"
                title="Add files, ZIP, or a folder"
                aria-label="Add files, ZIP, or a folder"
                aria-haspopup="menu"
                aria-expanded={isUploadMenuOpen}
                onClick={() => setIsUploadMenuOpen((open) => !open)}
                disabled={isLoading}
              >
                <FiPlus size={"15.5px"} />
              </button>
              {isUploadMenuOpen && (
                <div className="upload-picker-menu" role="menu">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsUploadMenuOpen(false);
                      fileInputRef.current?.click();
                    }}
                  >
                    Choose files or ZIP
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsUploadMenuOpen(false);
                      folderInputRef.current?.click();
                    }}
                  >
                    Choose a folder
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={fileTypes}
                style={{ display: "none" }}
                onChange={handleFileChange}
                disabled={isLoading}
              />
              <input
                ref={folderInputRef}
                type="file"
                multiple
                webkitdirectory=""
                directory=""
                style={{ display: "none" }}
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </div>
            {files.length > 0 && (
              <div className="selected-files" aria-label="Selected files">
                {files.map((file) => (
                  <span className="selected-file" key={`${getFilePath(file)}:${file.size}:${file.lastModified}`}>
                    <span className="selected-file-name" title={getFilePath(file)}>{getFilePath(file)}</span>
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
                ))}
              </div>
            )}
          </div>

          <div className="input-actions-right">
            <SpeechToText
              disabled={isLoading}
              onTranscript={(transcript) => {
                setText((currentText) =>
                  `${currentText}${currentText && !currentText.endsWith(" ") ? " " : ""}${transcript}`
                );
              }}
            />
            <button
              type="button"
              className="submit-btn"
              onClick={submitMessage}
              disabled={isLoading || !text.trim()}
              title="Send message"
              aria-label="Send message"
            >
              {isLoading ? <LoadingContent /> : <FiArrowUp />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Input;