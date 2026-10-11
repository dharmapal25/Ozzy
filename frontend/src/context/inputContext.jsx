import React, { createContext, useState, useContext } from 'react';

export const inputContext = createContext();

export const InputProvider = ({ children }) => {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);


  const handleSendMessage = () => {
    if (!text.trim() && (!files || files.length === 0)) return;
    
    console.log("Sending text via context:", text);
    console.log("Attached files via context:", files);

    // API call 
    
    setText("");
    setFiles([]);
  };

  return (
    <inputContext.Provider
      value={{
        text,
        setText,
        files,
        setFiles,
        handleSendMessage,
      }}
    >
      {children}
    </inputContext.Provider>
  );
};


// Custom Hook 
export const useInput = () => useContext(inputContext);