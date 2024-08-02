import React, { useState, useEffect ,useContext} from 'react';
import Topbar from './components/Topbar';
import AdminSidebar from './components/AdminSidebar';
import './UserManagement.css';
import EditUserForm from './components/EditUserForm';
import Swal from 'sweetalert2';
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
         
         Swal.fire('Failed',`Failed to fetch users: ${response.statusText}`, 'error');
          
        }

        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        Swal.fire('Failed',err.message, 'error');
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
      alert(updatedUser.username);
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
        Swal.fire('Error' ,'Failed to update user', 'error');
        
      }

      const updatedUserData = await response.json();
      setUsers(users.map(user => user.username === updatedUserData.username ? updatedUserData : user));
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating user:', error);
      Swal.fire('Error' ,`${error}`, 'error');
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
        Swal.fire('Failed' ,`Failed to delete user`, 'error');
        
      }

      setUsers(users.filter(user => user.username !== username));
    } catch (error) {
      console.error('Error deleting user:', error);
      Swal.fire('Error' ,`Error deleting user : ${error}`, 'error');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
 
  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="main-content">
        <Topbar />
        <div className="content-wrapper">
          <div className="user-management">
            <h2>User Management</h2>
            {users.length === 0 ? (
              <p>No users available</p>
            ) : (
              <table>
                <thead>
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
                        <button onClick={() => handleEditClick(user)}>Edit</button>
                        <button onClick={() => handleDeleteClick(user.username)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
