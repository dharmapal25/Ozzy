import { useEffect, useRef, useState } from "react";
import { FiDownload } from "react-icons/fi";
import useDownload from "../../hooks/useDownload";

const storageKey = "ozzy-workspace-notes";

const WorkspaceNotes = ({ onError }) => {
  const { downloadFile } = useDownload(onError);
  const [initialNotes] = useState(() => {
    try {
      return { value: localStorage.getItem(storageKey) || "", error: "" };
    } catch (storageError) {
      return { value: "", error: storageError.message || "Could not load saved notes." };
    }
  });
  const [notes, setNotes] = useState(initialNotes.value);
  const skipInitialSave = useRef(true);

  useEffect(() => {
    if (initialNotes.error) onError(initialNotes.error);
  }, [initialNotes.error, onError]);

  useEffect(() => {
    if (skipInitialSave.current) {
      skipInitialSave.current = false;
      return;
    }
    try {
      localStorage.setItem(storageKey, notes);
    } catch (storageError) {
      onError(storageError.message || "Could not save notes.");
    }
  }, [notes, onError]);

  return (
    <div className="workspace-notes">
      <textarea
        className="workspace-notes-input"
        aria-label="Notes"
        placeholder="Write your notes..."
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />
      <button
        type="button"
        className="generated-file-editor-download workspace-notes-download"
        onClick={() => downloadFile({ filename: "notes.txt", content: notes })}
      >
        <FiDownload aria-hidden="true" />
        Download notes
      </button>
    </div>
  );
};

export default WorkspaceNotes;
