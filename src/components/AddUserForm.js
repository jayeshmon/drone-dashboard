import React, { useState } from 'react';
import './AddUserForm.css';
import Swal from 'sweetalert2';

const AddUserForm = ({ onClose, onSave }) => {
  const [companyName, setCompanyName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [assignedDevice, setAssignedDevice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { companyName, firstName, lastName, mobile, username, password, role, assignedDevice };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User registered:', data);
        Swal.fire('Success', `User Added Successfully:  `, 'success');
        if (onSave) onSave(newUser);  // Ensure onSave is defined before calling it
      } else {
        const error = await response.text();
        console.error('Error registering user:', error);
        Swal.fire('Error', `Error Registering User: ${error} `, 'error');
      }
    } catch (err) {
      console.error('Error registering user:', err.message);
      Swal.fire('Error', `Error Registering User ${err.message} `, 'error');
    }

    onClose();
  };

  return (
    <div className="aumodal">
      <div className="aumodal-content">
        <h2>Add User</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Company Name:
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </label>
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
              <option value="user">User</option>
              <option value="admin">Super Admin</option>
            </select>
          </label>
          
          <div className="aumodal-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="button" onClick={() => {
              setCompanyName('');
              setFirstName('');
              setLastName('');
              setMobile('');
              setEmail('');
              setPassword('');
              setRole('user');
              setAssignedDevice('');
            }}>Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;
