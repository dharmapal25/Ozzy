import { createContext, useContext, useState } from 'react';

const inputContext = createContext(null);

export const InputProvider = ({ children }) => {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);

  return (
    <inputContext.Provider
      value={{
        text,
        setText,
        files,
        setFiles,
      }}
    >
      {children}
    </inputContext.Provider>
  );
}

// Keep the hook beside its provider so the context remains a single file.
// eslint-disable-next-line react-refresh/only-export-components
export const useInput = () => {
  const context = useContext(inputContext);
  if (!context) {
    throw new Error("useInput must be used within an InputProvider");
  }
  return context;
};