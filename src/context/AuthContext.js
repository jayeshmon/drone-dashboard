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
      Swal.fire('success',`${process.env.REACT_APP_API_URL}`,"success");
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/login`, { username, password });
      const { token, role } = res.data;
      const user = { username, role };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.removeItem('droneData');
      Swal.fire('success', 'Welcome, You have logged in successfully', 'success');

      setAuthState({ isAuthenticated: true, user, token });
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      console.error(err);
      Swal.fire('error', 'Invalid credentials', 'error');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('droneData');
    localStorage.setItem('type', 'all');
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
