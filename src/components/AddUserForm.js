import React, { useState } from 'react';
import './AddUserForm.css';

const AddUserForm = ({ onClose, onSave }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [assignedDevice, setAssignedDevice] = useState('');

  const handleSubmit = () => {
    const newUser = { firstName, lastName, mobile, email, password, role, assignedDevice };
    onSave(newUser);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add User</h2>
        <label>
          First Name:
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </label>
        <label>
          Last Name:
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </label>
        <label>
          Mobile Number:
          <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        </label>
        <label>
          Email:
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="USER">User</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </label>
        <label>
          Assign Device:
          <input type="text" value={assignedDevice} onChange={(e) => setAssignedDevice(e.target.value)} />
        </label>
        <div className="modal-actions">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => {
            setFirstName('');
            setLastName('');
            setMobile('');
            setEmail('');
            setPassword('');
            setRole('USER');
            setAssignedDevice('');
          }}>Reset</button>
        </div>
      </div>
    </div>
  );
};

export default AddUserForm;
