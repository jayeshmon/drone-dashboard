import React, { useState, useEffect } from 'react';
import { LoadScript, Marker } from '@react-google-maps/api';
import AddUserForm from './AddUserForm';
import AddDronePopup from './AddDronePopup';
import TilesComponent from './TilesComponent';
import MapComponent from './MapComponent';
import DroneCard from './DroneCard';
import Topbar from './Topbar';
import './AdminDashboard.css';
import AdminSidebar from './AdminSidebar';
import userIcon from '../assets/user-icon.png';
import droneIcon from '../assets/drone-icon.png';

const libraries = ['places'];

const AdminDashboard = ({ onAddUser, onAddDevice }) => {
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showAddDeviceForm, setShowAddDeviceForm] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (showAddUserForm) setShowAddUserForm(false);
        if (showAddDeviceForm) setShowAddDeviceForm(false);
      }
      if (event.key === 'Enter') {
        if (showAddUserForm) document.getElementById('userFormSubmitButton').click();
        if (showAddDeviceForm) document.getElementById('deviceFormSubmitButton').click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showAddUserForm, showAddDeviceForm]);

  const handleAddUser = (user) => {
    console.log("Adding user", user);
    onAddUser(user);
    setShowAddUserForm(false);
  };

  const handleAddDevice = (device) => {
    console.log("Adding device", device);
    onAddDevice(device);
    setShowAddDeviceForm(false);
  };

 



  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="main-content">
      <Topbar />
        <div className="content-wrapper">
          <div className="row">
            <div className="col-12">
           
              <MapComponent />
          
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <TilesComponent />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <DroneCard />
            </div>
          </div>
        </div>

        {/* New Button Wrapper */}
        <div className="button-wrapper">
          <div className="half-circle">
            <button onClick={() => setShowAddUserForm(true)} className="add-user-btn">
            <img src={userIcon} alt="Add User" />

              <span>Add User</span>
            </button>
            <button onClick={() => setShowAddDeviceForm(true)} className="add-device-btn">
            <img src={droneIcon} alt="Add Drone" />
              <span>Add Drone</span>
            </button>
          </div>
        </div>
      </div>

      {showAddUserForm && (
        <div className="modal-overlay">
          <AddUserForm
            onClose={() => setShowAddUserForm(false)}
            onSave={handleAddUser}
          />
        </div>
      )}

      {showAddDeviceForm && (
        <div className="modal-overlay">
          <AddDronePopup
            onClose={() => setShowAddDeviceForm(false)}
            onSave={handleAddDevice}
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
