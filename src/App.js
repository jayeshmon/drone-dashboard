import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { LoadScript } from '@react-google-maps/api';
import Dashboard from './components/Dashboard';
import DroneDetails from './components/DroneDetails';
import RealtimeTracking from './components/RealtimeTracking';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import './App.css';
import UserManagement from './UserManagement';
import Drones from './components/Drones';
import FleetManagement from './components/FleetManagement';



const ProtectedRoute = ({ element, roles, ...rest }) => {
  const { authState } = React.useContext(AuthContext);
  const token = localStorage.getItem('token');
  if (token) {
    const user = JSON.parse(localStorage.getItem('user'));
    authState.isAuthenticated= true;
    authState.user=user;
    authState.token= token;
  }
  // Redirect to login if not authenticated
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Redirect if role is not allowed
  if (roles && !roles.includes(authState.user.role)) {
    return <Navigate to="/" />;
  }

  return element;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/realtime-tracking" element={<ProtectedRoute element={<RealtimeTracking />} />} />
            <Route path="/fleet-management" element={<ProtectedRoute element={<FleetManagement />} />} />
            <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} roles={['admin']} />} />
            <Route path="/admin/users" element={<ProtectedRoute element={<UserManagement />} roles={['admin']} />} />
            <Route path="/admin/drones" element={<ProtectedRoute element={<Drones />} roles={['admin']} />} />
            <Route path="/RealtimeTracking" element={<ProtectedRoute element={<RealtimeTracking />} roles={['admin']} />} />
            <Route path="/drone-details/*" element={<DroneDetails />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </AuthProvider>
      <LoadScript googleMapsApiKey="AIzaSyD2pv1cMfEPmW9AtnWXRSoGypKA7orXifE" />
    </Router>
  );
};

export default App;
