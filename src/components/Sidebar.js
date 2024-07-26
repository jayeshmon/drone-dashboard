import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar collapsed">
      <div className="sidebar-content">
        <ul>
          <li>
            <Link to="/dashboard">
              <i className="fas fa-th-large"></i>
              <span className="tooltip">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/fleet-management">
              <i className="fas fa-users-cog"></i>
              <span className="tooltip">Fleet Management</span>
            </Link>
          </li>
          <li>
            <Link to="/realtime-tracking">
              <i className="fas fa-map-marker-alt"></i>
              <span className="tooltip">Realtime Tracking</span>
            </Link>
          </li>
          <li>
            <Link to="/super-admin-dashboard">
              <i className="fas fa-user-shield"></i>
              <span className="tooltip">Super Admin</span>
            </Link>
          </li>
          <li>
            <Link to="/user-management">
              <i className="fas fa-users"></i>
              <span className="tooltip">User Management</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="sidebar-footer">
        <ul>
          <li>
            <i className="fas fa-bell"></i>
            <span className="tooltip">Notifications</span>
          </li>
          <li>
            <i className="fas fa-cog"></i>
            <span className="tooltip">Settings</span>
          </li>
          <li>
            <i className="fas fa-user"></i>
            <span className="tooltip">Profile</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
