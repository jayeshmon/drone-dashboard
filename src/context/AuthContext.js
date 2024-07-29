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
      const res = await axios.post('http://localhost:3003/login', { username, password });
      const { token, role } = res.data;
      const user = { username, role };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      Swal.fire('Success','Welcome , You have logged in successfully', 'Success');
      setAuthState({ isAuthenticated: true, user, token });
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      console.error(err);
      
      Swal.fire('Failed','Invalid credentials', 'failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({ isAuthenticated: false, user: null, token: null });
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
