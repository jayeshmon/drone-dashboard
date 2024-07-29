// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Dashboard from './components/Dashboard';

import RealtimeTracking from './components/RealtimeTracking';
import AdminDashboard from './components/AdminDashboard'; // Import AdminDashboard
import Login from './components/Login';

import './App.css';
import UserManagement from './UserManagement';
import Drones from './components/Drones';


const ProtectedRoute = ({ element, roles, ...rest }) => {
  const { authState } = React.useContext(AuthContext);
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" />;
  }
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
            
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Dashboard />} />}
            />
            <Route
              path="/realtime-tracking"
              element={<ProtectedRoute element={<RealtimeTracking />} />}
            />
         
            <Route
              path="/admin"
              element={<ProtectedRoute element={<AdminDashboard />} roles={['admin']} />}
            />
            
            <Route
              path="/admin/users"
              element={<ProtectedRoute element={<UserManagement/>} roles={['admin']} />}
            />
            <Route
              path="/admin/drones"
              element={<ProtectedRoute element={<Drones/>} roles={['admin']} />}
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
