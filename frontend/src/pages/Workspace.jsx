import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Input from "./Input";
import { FiMenu, FiMoreVertical } from "react-icons/fi";
import "../style/Workspace.css";

const Workspace = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentWorkId, setCurrentWorkId] = useState(null);
  const [works, setWorks] = useState([
    { _id: "1", title: "Project Docs Analysis" },
    { _id: "2", title: "API Authentication Flow" }
  ]);
  const [messages, setMessages] = useState([]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleNewWork = () => {
    setCurrentWorkId(null);
    setMessages([]);
    setSidebarOpen(false);
  };

  const handleSelectWork = (id) => {
    setCurrentWorkId(id);
    setSidebarOpen(false);
  };

  const handleSendMessage = (text) => {
    setMessages((prev) => [...prev, { role: "user", content: text }]);
  };

  return (
    <div className="workspace-wrapper">
      {/* Backdrop for mobile when sidebar is open */}
      {sidebarOpen && <div className="sidebar-backdrop" onClick={toggleSidebar}></div>}

      {/* Sidebar Component */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={toggleSidebar}
        works={works}
        onSelectWork={handleSelectWork}
        onNewWork={handleNewWork}
        currentWorkId={currentWorkId}
      />

      {/* Main Work Frame */}
      <div className="workspace-main">
        {/* Header bar */}
        <div className="workspace-header">
          <button className="mobile-menu-trigger" onClick={toggleSidebar}>
            <FiMenu />
          </button>

          <h1 className="workspace-title">Work</h1>

          {/* Top-Right 3-Dots Menu */}
          <div className="menu-wrapper">
            <button className="menu-trigger-btn" onClick={toggleMenu}>
              <FiMoreVertical />
            </button>

            {menuOpen && (
              <div className="dropdown-menu">
                <button onClick={() => setMenuOpen(false)}>Share</button>
                <button onClick={() => setMenuOpen(false)}>Full screen</button>
                <button onClick={() => setMenuOpen(false)}>Bookmark</button>
                <button onClick={() => { handleNewWork(); setMenuOpen(false); }}>New Work</button>
                <button onClick={() => setMenuOpen(false)}>Download chat</button>
                <button className="delete-btn" onClick={() => setMenuOpen(false)}>Delete</button>
              </div>
            )}
          </div>
        </div>

        {/* Workspace Body / Chat Area */}
        <div className="workspace-body">
          {messages.length === 0 ? (
            <div className="empty-workspace-state">
              <p>Explain about your docs with other tasks.</p>
            </div>
          ) : (
            <div className="chat-messages-container">
              {messages.map((m, idx) => (
                <div key={idx} className={`chat-message ${m.role}`}>
                  {m.content}
                </div>
              ))}
            </div>
          )}

          {/* Bottom Docked Input */}
          <div className="input-dock">
            <Input onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;