import React, { useState, useEffect } from 'react';
import Topbar from './components/Topbar';
import AdminSidebar from './components/AdminSidebar';
import './UserManagement.module.css';
import EditUserForm from './components/EditUserForm';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch('http://localhost:3003/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        Swal.fire('Failed', err.message, 'error');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditForm(true);
  };

  const handleEditSave = async (updatedUser) => {
    try {
      const response = await fetch(`http://localhost:3003/users/${updatedUser.username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedUser)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUserData = await response.json();
      setUsers(users.map(user => user.username === updatedUserData.username ? updatedUserData : user));
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating user:', error);
      Swal.fire('Error', `${error}`, 'error');
    }
  };

  const handleDeleteClick = async (username) => {
    try {
      const response = await fetch(`http://localhost:3003/users/delete/${username}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter(user => user.username !== username));
    } catch (error) {
      console.error('Error deleting user:', error);
      Swal.fire('Error', `Error deleting user: ${error}`, 'error');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="admin-dashboard d-flex">
      <AdminSidebar />
      <div className="main-content flex-grow-1 p-3">
        <Topbar />
        <div className="content-wrapper p-3">
          <div className="user-management container">
            <h2>User Management</h2>
            {users.length === 0 ? (
              <p>No users available</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>Username</th>
                      <th>Company</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.username}>
                        <td>{user.username}</td>
                        <td>{user.companyName}</td>
                        <td>{user.role}</td>
                        <td>
                          <button className="btn btn-success btn-sm me-2" onClick={() => handleEditClick(user)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(user.username)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      {showEditForm && selectedUser && (
        <EditUserForm
          user={selectedUser}
          onClose={() => setShowEditForm(false)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
};

export default UserManagement;
