import React, { useState } from 'react';
import AddUserForm from './components/AddUserForm';
import AddDronePopup from './components/AddDronePopup';
import TilesComponent from './components/TilesComponent';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = ({ onAddUser }) => {
    const [showAddUserForm, setShowAddUserForm] = useState(false);
    const [showAddDeviceForm, setShowAddDeviceForm] = useState(false);
  
    const handleAddUser = (user) => {
      onAddUser(user);
      setShowAddUserForm(false);
    };
  
    return (
      <div className="super-admin-dashboard">
        <TilesComponent />
        <button className="add-user-btn" onClick={() => setShowAddUserForm(true)}>Add User</button>
        <button className="add-device-btn" onClick={() => setShowAddDeviceForm(true)}>Add Device</button>
  
        {showAddUserForm && (
          <AddUserForm
            onClose={() => setShowAddUserForm(false)}
            onSave={handleAddUser}
          />
        )}
  
        {showAddDeviceForm && (
          <AddDronePopup
            onClose={() => setShowAddDeviceForm(false)}
            // Pass any required props to AddDronePopup
          />
        )}
      </div>
    );
  };
  
  export default SuperAdminDashboard;