import React, { useState } from 'react';
import './AddUserForm.css';

const AddUserForm = ({ onClose, onSave }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [assignedDevice, setAssignedDevice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { firstName, lastName, mobile, username, password, role, assignedDevice };

    try {
      const response = await fetch('http://localhost:3003/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User registered:', data);
        onSave(newUser);
      } else {
        const error = await response.text();
        console.error('Error registering user:', error);
        alert('Error registering user: ' + error);
      }
    } catch (err) {
      console.error('Error registering user:', err.message);
      alert('Error registering user: ' + err.message);
    }

    onClose();
  };

  return (
    <div className="aumodal">
      <div className="aumodal-content">
        <h2>Add User</h2>
        <form onSubmit={handleSubmit}>
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
            <input type="email" value={username} onChange={(e) => setEmail(e.target.value)} />
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
          <div className="aumodal-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="button" onClick={() => {
              setFirstName('');
              setLastName('');
              setMobile('');
              setEmail('');
              setPassword('');
              setRole('USER');
              setAssignedDevice('');
            }}>Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;
