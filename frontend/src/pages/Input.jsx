import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { IoMic } from "react-icons/io5";
import { RiSendPlaneFill } from "react-icons/ri";

const Input = ({ onSendMessage, onFileUpload }) => {
  const [text, setText] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
  };

  return (
    <div className="work-input-container">
      {/* File attach button (+) */}
      <label className="input-action-btn file-label" title="Upload files">
        <FiPlus />
        <input
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={(e) => onFileUpload && onFileUpload(e.target.files)}
        />
      </label>

      {/* Text Area / Input */}
      <input
        type="text"
        className="prompt-input"
        placeholder="Ask something uploaded docs related..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {/* Action / AI Generate icons */}
      <div className="input-actions-right">
        <button className="icon-btn-secondary" title="Suggestions">
          <IoMic />
        </button>
        <button className="submit-btn" onClick={handleSubmit} title="Send prompt">
          <RiSendPlaneFill />
        </button>
      </div>
    </div>
  );
};

export default Input;