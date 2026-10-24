import { useCallback, useEffect, useRef, useState } from "react";

const useSpeechToText = (onTranscript) => {
  const recognitionRef = useRef(null);
  const onTranscriptRef = useRef(onTranscript);
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const toggleListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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

      if (transcript) onTranscriptRef.current(transcript);
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
  }, []);

  return { isListening, status, toggleListening };
};

export default useSpeechToText;
