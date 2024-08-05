// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(localStorage.getItem('user'));
      setAuthState({ isAuthenticated: true, user, token });
    }
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post('http://dashboard.fuselage.co.in:3003/login', { username, password });
      const { token, role } = res.data;
      const user = { username, role };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.removeItem('droneData');
      Swal.fire('success','Welcome , You have logged in successfully', 'success');

      setAuthState({ isAuthenticated: true, user, token });
      navigate(role === 'admin' ? 'http://dashboard.fuselage.co.in:3001/admin' : 'http://dashboard.fuselage.co.in:3001/dashboard');
    } catch (err) {
      console.error(err);
      
      Swal.fire('error','Invalid credentials', 'error');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('droneData');
    localStorage.setItem('type','all')
    setAuthState({ isAuthenticated: false, user: null, token: null });
    navigate('http://dashboard.fuselage.co.in:3001/login');
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
