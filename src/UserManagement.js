import React, { useState, useEffect } from 'react';
import Topbar from './components/Topbar';
import AdminSidebar from './components/AdminSidebar';
import './UserManagement.css';
import EditUserForm from './components/EditUserForm';
import AddUserForm from './components/AddUserForm';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaDownload, FaPlus, FaSearch } from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${updatedUser.username}`, {
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/delete/${username}`, {
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleDownloadClick = () => {
    const csvData = users.map(user => ({
      Username: user.username,
      Company: user.companyName,
      Role: user.role,
    }));

    const csvContent = [
      ['Username', 'Company', 'Role'],
      ...csvData.map(item => [item.Username, item.Company, item.Role])
    ]
      .map(e => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "users.csv";
    link.click();
  };

  const filteredUsers = users.filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="admin-dashboard d-flex">
      <AdminSidebar />
      <div className="user-content flex-grow-1 p-3">
        <Topbar />
        <div className="content-wrapper p-3">
          <div className="user-management container">
            <h2>User Management</h2>
            <div className="toolbar d-flex justify-content-end align-items-center mb-3">
              <div className="searchbar d-flex align-items-center me-3">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search" 
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <FaSearch className="ms-2" />
              </div>
              <button className="btn btn-primary me-2" onClick={handleAddClick}><FaPlus /> Add</button>
              <button className="btn btn-secondary" onClick={handleDownloadClick}><FaDownload /> Download</button>
            </div>
            {filteredUsers.length === 0 ? (
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
                    {filteredUsers.map(user => (
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
      {showAddForm && (
        <AddUserForm
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

export default UserManagement;
