import { useEffect, useRef, useState } from "react";
import { IoMic } from "react-icons/io5";

const SpeechToText = ({ onTranscript, disabled = false }) => {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("");
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    if (!SpeechRecognition) {
      setStatus("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = navigator.language;
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onstart = () => {
      setStatus("");
      setIsListening(true);
    };
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .slice(event.resultIndex)
        .filter((result) => result.isFinal)
        .map((result) => result[0].transcript)
        .join(" ")
        .trim();

      if (transcript) onTranscript(transcript);
    };
    recognition.onerror = (event) => {
      setStatus(`Speech recognition error: ${event.error}`);
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (error) {
      recognitionRef.current = null;
      setStatus(`Could not start speech recognition: ${error.message}`);
    }
  };

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
