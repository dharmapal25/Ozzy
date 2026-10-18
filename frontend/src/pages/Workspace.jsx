import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Input from "./Input";
import { FiMenu, FiMoreVertical } from "react-icons/fi";
import "../style/Workspace.css";
import { useConversation } from "../context/WorkContext";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Workspace = () => {

  const {
    WorkConversationIdData,
    LoadWorkAllConversationData,
    sendWorkConversationData,
    setCurWork,
    Works,
    curWork,
    load,
    error,
  } = useConversation()

  const navigate = useNavigate();
  const { workId } = useParams();
  const { user, logout, error: authError } = useAuth();


  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");

  // const [works, setWorks] = useState([
  //   { _id: "1", title: "Project Docs Analysis" },
  //   { _id: "2", title: "API Authentication Flow" }
  // ]);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!workId) {
      setCurWork(null);
      setMessages([]);
      return;
    }

    setCurWork(null);
    WorkConversationIdData(workId).catch(() => {});
  }, [workId, WorkConversationIdData, setCurWork]);

  useEffect(() => {
    LoadWorkAllConversationData().catch(() => {});
  }, [LoadWorkAllConversationData]);

  useEffect(() => {
    setMessages(Array.isArray(curWork?.messages) ? curWork.messages : []);
  }, [curWork]);

  const toggleSidebar = () => setSidebarOpen((previous) => !previous);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleNewWork = () => {
    setMessages([]);
    setSidebarOpen(false);
    navigate("/work");
  };

  const handleSelectWork = (id) => {
    setSidebarOpen(false);
    navigate(`/work/${id}`);
  };

  const handleSendMessage = async (text, files = []) => {
    const activeWorkId = workId;

    setSendError("");
    setMessages((previous) => [
      ...previous,
      { _id: `user-${Date.now()}`, role: "user", content: text },
    ]);
    setIsSending(true);

    try {
      const information = await Promise.all(files.map(async (file) => {
        if (!/\.(txt|md|markdown|json|js|jsx|ts|tsx|py|java|c|h|cpp|css|html|xml|yaml|yml|csv|sql|log)$/i.test(file.name)) {
          throw new Error(`Unsupported file type: ${file.name}. Attach a text or source-code file.`);
        }

        return {
          filename: file.name,
          filetype: file.name.slice(file.name.lastIndexOf(".")),
          FileLocation: file.name,
          info: await file.text(),
        };
      }));

      const result = await sendWorkConversationData(information, text, activeWorkId);
      setMessages((previous) => [
        ...previous,
        {
          _id: `assistant-${Date.now()}`,
          role: "assistant",
          content: result.response,
        },
      ]);
      if (!activeWorkId && result?.workId) {
        LoadWorkAllConversationData().catch(() => {});
        navigate(`/work/${result.workId}`, { replace: true });
      }
    } catch (requestError) {
      setSendError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Could not get a response. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      // The auth context keeps the logout error available to the user.
    }
  };

  return (
    <div className="workspace-wrapper">
      {/* Backdrop for mobile when sidebar is open */}

      {
        sidebarOpen && <div className="sidebar-backdrop" onClick={toggleSidebar}></div>
      }

      {/* Sidebar Component */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={toggleSidebar}
        works={Works}
        onSelectWork={handleSelectWork}
        onNewWork={handleNewWork}
        currentWorkId={workId || null}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Work Frame */}
      <div className="workspace-main">
        {/* Header bar */}
        <div className="workspace-header">
          <button
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
            title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
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

          {(error || authError || sendError) && (
            <p className="workspace-error" role="alert">{error || authError || sendError}</p>
          )}
          
          {workId && load && messages.length === 0 ? (
            <div className="empty-workspace-state" role="status">
              <p>Loading conversation...</p>
            </div>
          ) : messages.length === 0 ? (
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
              {isSending && (
                <div className="chat-message assistant typing-indicator" role="status">
                  Thinking…
                </div>
              )}
            </div>
          )}

          {/* Bottom Docked Input */}
          <div className="input-dock">
            <Input onSendMessage={handleSendMessage} isLoading={isSending} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;