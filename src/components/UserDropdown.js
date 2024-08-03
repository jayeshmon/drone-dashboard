import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const UserDropdown = ({ selectedUser, onUserChange }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3003/users/user');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Error fetching users:', await response.text());
          Swal.fire('Error', 'Error Fetching Users', 'error');
        }
      } catch (err) {
        Swal.fire('Error', `Error fetching users: ${err.message}`, 'error');
        console.error('Error fetching users:', err.message);
      }
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search User"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <select
        value={selectedUser}
        onChange={(e) => onUserChange(e.target.value)}
      >
        <option value="">Select User</option>
        {filteredUsers.map(user => (
          <option key={user._id} value={user._id}>
            {user.companyName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserDropdown;
