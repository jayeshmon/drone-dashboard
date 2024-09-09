import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';
import Swal from 'sweetalert2';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password, navigate);
  };

  return (
    <div className="login-page-container">
      <form className="login-page-form" onSubmit={handleSubmit}>
        <div className="login-page-form-group">
          <i className="fa fa-user"></i>
          <input
            type="text"
            className="login-page-form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </div>
        <div className="login-page-form-group">
          <i className="fa fa-lock"></i>
          <input
            type="password"
            className="login-page-form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <div className="login-page-remember-me">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#">Forgot Password?</a>
        </div>
        <button type="submit" className="login-page-btn">Login</button>
      </form>
    </div>
  );
};

export default Login;
