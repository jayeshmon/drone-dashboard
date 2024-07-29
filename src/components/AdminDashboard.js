import React, { useState } from 'react';
import AddUserForm from './AddUserForm';
import AddDronePopup from './AddDronePopup';
import TilesComponent from './TilesComponent';
import MapComponent from './MapComponent';
import DroneCard from './DroneCard';
import Topbar from './Topbar';
import './AdminDashboard.css';
import AdminSidebar from './AdminSidebar';
import Swal from 'sweetalert2';
const AdminDashboard = ({ onAddUser, onAddDevice }) => {
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showAddDeviceForm, setShowAddDeviceForm] = useState(false);

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
        <button className="add-user-btn" onClick={() => setShowAddUserForm(true)}>Add User</button>
        <button className="add-device-btn" onClick={() => setShowAddDeviceForm(true)}>Add Device</button>
      </div>

      {showAddUserForm && (
        <AddUserForm
          onClose={() => setShowAddUserForm(false)}
          onSave={handleAddUser}
        />
      )}

      {showAddDeviceForm && (
        <AddDronePopup
          onClose={() => setShowAddDeviceForm(false)}
          onSave={handleAddDevice}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
