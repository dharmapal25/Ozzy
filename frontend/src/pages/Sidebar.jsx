import { RiChatNewLine } from "react-icons/ri";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

const Sidebar = ({ isOpen, onClose, works = [], onSelectWork, onNewWork, currentWorkId, user, onLogout }) => {
  return (
    <aside className={`work-sidebar ${isOpen ? "open" : ""}`}>


      <div className="sidebar-header">

        <button className="icon-btn" onClick={onNewWork} title="New Work">
          <RiChatNewLine />
        </button>

        <button className="icon-btn" onClick={onClose} title="Close Sidebar">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

      </div>



      {/* Works Titles List */}
      <div className="sidebar-content">
        <span className="sidebar-label">Works titles</span>
        <ul className="works-list">
          {works.map((item) => (
            <li
              key={item._id}
              className={`work-item ${currentWorkId === item._id ? "active" : ""}`}
              onClick={() => onSelectWork(item._id)}
            >
              {item.title || "Untitled Workspace"}
            </li>
          ))}
        </ul>
      </div>



      {/* Profile and Settings/Globe */}
      <div className="sidebar-footer">
        <div className="user-info">

          {
            user?.avatar ?
              <img className="user-avatar" src={user.avatar} alt="" />
              : <FaUserCircle className="user-avatar" />
          }

          <span className="user-name">{user?.displayName || user?.email || "Profile"}</span>

        </div>


        <button className="footer-btn" onClick={onLogout} title="Log out" aria-label="Log out">
          <FiLogOut aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;