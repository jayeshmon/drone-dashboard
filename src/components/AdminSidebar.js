// src/components/AdminSidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const AdminSidebar = () => {
  return (
    <div className="sidebar collapsed">
      <div className="sidebar-content">
        <ul>
          <li>
            <Link to="/admin/dashboard">
              <i className="fas fa-drone"></i>
              <span className="tooltip">Drones</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/users">
              <i className="fas fa-users"></i>
              <span className="tooltip">Users</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/drones">
              <i className="fas fa-users"></i>
              <span className="tooltip">Users</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/settings">
              <i className="fas fa-cog"></i>
              <span className="tooltip">Settings</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/logout">
              <i className="fas fa-sign-out-alt"></i>
              <span className="tooltip">Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
