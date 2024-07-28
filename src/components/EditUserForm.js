import React, { useState } from 'react';
import './EditUserForm.css';

const EditUserForm = ({ user, onClose, onSave }) => {
  const [companyName, setCompanyName] = useState(user.companyName || '');

  const [mobile, setMobile] = useState(user.mobile || '');
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(user.role || '');
  
  const handleSubmit = () => {
    const updatedUser = { ...user, companyName, mobile, email, password, role };
    onSave(updatedUser);
  };

  return (
    <div className="eumodal">
      <div className="eumodal-content">
        <h2>Edit User</h2>
        <label>
          Company Name:
          <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        </label>
       
        <label>
          Mobile Number:
          <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        </label>
       
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Super Admin</option>
          </select>
        </label>
       
        <div className="eumodal-actions">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditUserForm;
