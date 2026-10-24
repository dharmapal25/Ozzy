import { IoMic } from "react-icons/io5";
import useSpeechToText from "../hooks/useSpeechToText";

const SpeechToText = ({ onTranscript, disabled = false }) => {
  const { isListening, status, toggleListening } = useSpeechToText(onTranscript);

  return (
    <>
      <button
        type="button"
        className={`icon-btn-secondary${isListening ? " listening" : ""}`}
        onClick={toggleListening}
        disabled={disabled}
        title={isListening ? "Stop speaking" : "Speak to text"}
        aria-label={isListening ? "Stop speech recognition" : "Start speech recognition"}
        aria-pressed={isListening}
      >
        <IoMic />
      </button>
      {status && <span className="speech-status" role="status">{status}</span>}
    </>
  );
};

export default SpeechToText;
