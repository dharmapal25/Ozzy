import React from "react";
import { RiChatNewLine } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { FiPlus, FiMenu, FiX, FiGlobe } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

const Sidebar = ({ isOpen, onClose, works = [], onSelectWork, onNewWork, currentWorkId }) => {
  return (
    <aside className={`work-sidebar ${isOpen ? "open" : ""}`}>
      

      <div className="sidebar-header">
        <button className="icon-btn add-btn" onClick={onNewWork} title="New Work">
          <RiChatNewLine />
        </button>
        <button className="icon-btn close-btn" onClick={onClose} title="Close Sidebar">
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

      {/* Footer: Profile and Settings/Globe */}
      <div className="sidebar-footer">
        <div className="user-info">
          <FaUserCircle className="user-avatar" />
          <span className="user-name">Profile</span>
        </div>
        <button className="icon-btn footer-btn">
          <IoSettingsOutline />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;