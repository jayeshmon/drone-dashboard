import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
const handleLogout = () => {
  // Clear the token (or any other authentication data)
  localStorage.removeItem('token'); // Remove the token from localStorage (or any other storage)
  localStorage.removeItem('user'); 
  localStorage.removeItem('droneData');
  localStorage.removeItem('droneData2');  
  localStorage.removeItem('droneLocations'); 
  
  // Optionally, you can clear other user-related data here

  // Redirect the user to the login page
  navigate('/login');
};

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
            <Link to="/login" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              <span className="admintooltip">Logout</span>
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
