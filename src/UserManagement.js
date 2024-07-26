import React, { useState } from 'react';
import EditUserForm from './components/EditUserForm';
import './UserManagement.css';

const UserManagement = ({ users, onEditUser, onDeleteUser }) => {
    const [editingUser, setEditingUser] = useState(null);
  
    const handleEditUser = (updatedUser) => {
      onEditUser(updatedUser);
      setEditingUser(null);
    };
  
    return (
      <div className="user-management">
        <h1>Manage Users</h1>
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Mobile Number</th>
              <th>Email</th>
              <th>Role</th>
              <th>Assigned Device</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.mobile}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.assignedDevice}</td>
                <td>
                  <button onClick={() => setEditingUser(user)}>Edit</button>
                  <button onClick={() => onDeleteUser(user)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        {editingUser && (
          <EditUserForm
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSave={handleEditUser}
          />
        )}
      </div>
    );
  };
  
  export default UserManagement;