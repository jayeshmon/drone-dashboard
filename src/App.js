import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import FleetManagement from './components/FleetManagement';
import DroneDetails from './components/DroneDetails';
import RealtimeTracking from './components/RealtimeTracking';
import SuperAdminDashboard from './SuperAdminDashboard';
import UserManagement from './UserManagement';


import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);

  const addUser = (user) => {
    setUsers([...users, user]);
  };

  const editUser = (updatedUser) => {
    setUsers(users.map(user => user.email === updatedUser.email ? updatedUser : user));
  };

  const deleteUser = (userToDelete) => {
    setUsers(users.filter(user => user.email !== userToDelete.email));
  };

  const addDevice = (device) => {
    setDevices([...devices, device]);
  };

  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Topbar />
          <div className="content-wrapper">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/fleet-management" element={<FleetManagement />} />
              <Route path="/realtime-tracking" element={<RealtimeTracking />} />
              <Route path="/drone-details/:droneId" element={<DroneDetails />} />
              <Route path="/super-admin-dashboard" element={<SuperAdminDashboard onAddUser={addUser} onAddDevice={addDevice} />} />
              <Route path="/user-management" element={<UserManagement users={users} onEditUser={editUser} onDeleteUser={deleteUser} />} />
              <Route path="/" element={<Dashboard />} />
            </Routes>
    
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
