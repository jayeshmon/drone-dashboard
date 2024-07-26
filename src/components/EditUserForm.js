import React, { useState } from 'react';
import './EditUserForm.css';

const EditUserForm = ({ user, onClose, onSave }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [mobile, setMobile] = useState(user.mobile);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(user.role);
  const [assignedDevice, setAssignedDevice] = useState(user.assignedDevice);

  const handleSubmit = () => {
    const updatedUser = { ...user, firstName, lastName, mobile, email, password, role, assignedDevice };
    onSave(updatedUser);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit User</h2>
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
        </div>
      </div>
    </div>
  );
};

export default EditUserForm;
