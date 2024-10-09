// src/components/AdminSidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
  return (
    <div className="adminsidebar collapsed">
      <div className="adminsidebar-content">
        <ul>
          <li>
            <Link to="/admin">
              <i className="fas fa-th-large"></i>
              <span className="admintooltip">Drones</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/drones">
              <i className="fas fa-fan"></i>
              <span className="admintooltip">Drones</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/users">
              <i className="fas fa-users"></i>
              <span className="admintooltip">Users</span>
            </Link>
          </li>
          <li>
            <Link to="/RealtimeTracking">
              <i className="fas fa-map-marker-alt"></i>
              <span className="admintooltip">Realtime Tracking</span>
            </Link>
          </li>
          <li>
            <Link to="/login">
              <i className="fas fa-sign-out-alt"></i>
              <span className="admintooltip">Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
