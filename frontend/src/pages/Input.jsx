import React from "react";
import { FiPlus } from "react-icons/fi";
import { IoMic } from "react-icons/io5";
import { RiSendPlaneFill } from "react-icons/ri";
import { useInput } from "../context/inputContext";

const Input = () => {

  const { text, setText, files, setFiles, handleSendMessage } = useInput();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="work-input-container">

      {/* File attach button */}
      <label className="input-action-btn file-label" title="Upload files">
        <FiPlus />
        <input
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
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
        <button type="button" className="icon-btn-secondary" title="Mic">
          <IoMic />
        </button>
        <button
          type="button"
          className="submit-btn"
          onClick={handleSendMessage}
          title="Send prompt"
        >
          <RiSendPlaneFill />
        </button>
      </div>
    </div>
  );
};

export default Input;