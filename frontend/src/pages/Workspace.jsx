import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import Input from "./Input";
import MermaidDiagram from "../components/MermaidDiagram";
import GeneratedFiles from "../components/GeneratedFiles";
import { FiMenu, FiMoreVertical } from "react-icons/fi";
import "../style/Workspace.css";
import { useConversation } from "../context/WorkContext";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LoadingContent } from "../components/LoadingComponent";
import Share from "../components/tools/Share";
import ErrorHandlingComponent from "../components/ErrorHandlingComponent";

const MarkdownPre = ({ node, children, ...props }) => {
  const code = node?.children?.[0];
  const className = code?.properties?.className;
  const language = Array.isArray(className)
    ? className.find((name) => name.startsWith("language-"))?.slice(9).toLowerCase()
    : "";

  if (language === "mermaid") {
    const chart = code.children?.map((child) => child.value || "").join("") || "";
    return <MermaidDiagram chart={chart.replace(/\n$/, "")} />;
  }

  return <pre {...props}>{children}</pre>;
};

const getProjectFiles = (message) => {
  if (Array.isArray(message.projectFiles)) return message.projectFiles;
  if (typeof message.ProjectStructure !== "string" || !message.ProjectStructure) return [];

  try {
    const projectFiles = JSON.parse(message.ProjectStructure);
    return Array.isArray(projectFiles) ? projectFiles : [];
  } catch (parseError) {
    console.error("Could not read uploaded file details from chat history:", parseError);
    return [];
  }
};

const Workspace = () => {

  const {
    WorkConversationIdData,
    LoadWorkAllConversationData,
    sendWorkConversationData,
    Works,
    error,
  } = useConversation()

  const navigate = useNavigate();
  const { workId } = useParams();
  const { user, logout, error: authError } = useAuth();


  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const savedSidebarState = localStorage.getItem("sidebarOpen");
    if (savedSidebarState === "true") return true;
    if (savedSidebarState === "false") return false;
    return window.innerWidth > 768;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");

  const [chatState, setChatState] = useState({ workId: null, messages: [] });
  const messages = chatState.workId === workId ? chatState.messages : [];
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    if (!workId) return;

    WorkConversationIdData(workId)
      .then((conversation) => {
        setChatState({
          workId,
          messages: Array.isArray(conversation?.messages) ? conversation.messages : [],
        });
      })
      .catch(() => { });
  }, [workId, WorkConversationIdData]);

  useEffect(() => {
    LoadWorkAllConversationData().catch(() => { });
  }, [LoadWorkAllConversationData]);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", String(sidebarOpen));
  }, [sidebarOpen]);

  useLayoutEffect(() => {
    if (!isSending || !chatMessagesRef.current) return;
    chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
  }, [isSending, messages.length]);

  const toggleSidebar = () => setSidebarOpen((previous) => !previous);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleNewWork = () => {
    setSidebarOpen(false);
    navigate("/work");
  };

  const handleSelectWork = (id) => {
    setSidebarOpen(false);
    navigate(`/work/${id}`);
  };

  const handleSendMessage = async (text, files = []) => {
    const activeWorkId = workId;
    const userMessageId = `user-${Date.now()}`;

    setSendError("");
    setChatState((previous) => ({
      workId: activeWorkId,
      messages: [
        ...(previous.workId === activeWorkId ? previous.messages : []),
        { _id: userMessageId, role: "user", content: text, projectFiles: [] },
      ],
    }));
    setIsSending(true);

    try {
      const result = await sendWorkConversationData(files, text, activeWorkId);
      setChatState((previous) => ({
        workId: activeWorkId,
        messages: [
          ...(previous.workId === activeWorkId ? previous.messages : []).map((message) =>
            message._id === userMessageId
              ? { ...message, projectFiles: result.data || [] }
              : message
          ),
          {
            _id: `assistant-${Date.now()}`,
            role: "assistant",
            content: result.response,
            sources: result.sources || [],
          },
        ],
      }));
      if (!activeWorkId && result?.workId) {
        LoadWorkAllConversationData().catch(() => { });
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
      <ErrorHandlingComponent
        key={error || authError || sendError}
        message={error || authError || sendError}
      />
      {sidebarOpen && <div className="sidebar-backdrop" onClick={toggleSidebar}></div>}
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
                <button onClick={() => { setMenuOpen(false); setShareOpen(true); }}>Share</button>
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

          {messages.length > 0 && (
            <div className="chat-messages-container" ref={chatMessagesRef}>
              {messages.map((m, idx) => {
                const projectFiles = m.role === "user" ? getProjectFiles(m) : [];

                return (
                  <div key={idx} className={`chat-message ${m.role}`}>
                    {m.role === "user" ? (
                      <>
                        <div className="chat-message-content">{m.content}</div>
                        {projectFiles.length > 0 && (
                          <details className="chat-message-files">
                            <summary>Files ({projectFiles.length})</summary>
                            <ul>
                              {projectFiles.map((file, fileIndex) => (
                                <li key={`${file.FileLocation || file.filename}-${fileIndex}`}>
                                  {file.FileLocation || file.filename}
                                </li>
                              ))}
                            </ul>
                          </details>
                        )}
                      </>
                    ) : (
                      <div className="chat-message-content chat-markdown">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            pre: ({ node, children, ...props }) => {
                              const classNames = node?.children?.[0]?.properties?.className;
                              const language = Array.isArray(classNames)
                                ? classNames.find((name) => name.startsWith("language-"))
                                : "";
                              if (language?.startsWith("language-file:")) return null;
                              return <MarkdownPre node={node} {...props}>{children}</MarkdownPre>;
                            },
                          }}
                        >
                          {String(m.content ?? "").replace("[[download-generated-files-zip]]", "")}
                        </ReactMarkdown>
                      </div>
                    )}
                    {m.role === "assistant" && (
                      <GeneratedFiles content={m.content} onError={setSendError} />
                    )}
                    {m.role === "assistant" && Array.isArray(m.sources) && m.sources.length > 0 && (
                      <div className="chat-message-sources">
                        <span>Sources:</span>
                        {m.sources.map((source) => (
                          <span className="chat-message-source" key={source}>{source}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {isSending && (
                <div className="chat-message assistant typing-indicator" role="status">
                 <LoadingContent/>
                </div>
              )}
            </div>
          )}

          {/* Bottom Docked Input */}
          <div className={`input-dock${messages.length === 0 ? " input-dock-centered" : ""}`}>
            <Input onSendMessage={handleSendMessage} isLoading={isSending} />
          </div>
        </div>
      </div>
      {shareOpen && <Share onClose={() => setShareOpen(false)} />}
    </div>
  );
};

export default Workspace;