import React, { useState, useEffect } from 'react';
import './Drones.css';
import AddDronePopup from './AddDronePopup';
import EditDronePopup from './EditDronePopup';
import Topbar from './Topbar';
import AdminSidebar from './AdminSidebar';
import Sidebar from './Sidebar';
import Swal from 'sweetalert2';
import { FaPlus, FaSearch } from 'react-icons/fa';
import * as XLSX from 'xlsx'; // Import XLSX for download functionality

const Drones = () => {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [dronesData, setDronesData] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedDrone, setSelectedDrone] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Change this to the number of items you want per page

  useEffect(() => {
    fetchUsers();
    fetchDrones();
  }, []);

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchDrones = async () => {
    try {
      let response = '';
      if (user.role === 'admin') {
        response = await fetch(`${process.env.REACT_APP_API_URL}/alldronesdata`);
      } else {
        response = await fetch(`${process.env.REACT_APP_API_URL}/dronesdata/${user.username}`);
      }

      if (!response.ok) {
        Swal.fire('Failed', `Failed to fetch drones: ${response.statusText}`, 'error');
        throw new Error(`Failed to fetch drones: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      const formattedData = data.map(drone => ({
        ...drone,
        soc: drone.latestData?.MV || 'N/A',
        assignedUser: drone.assignedUserName 
      }));
      
      setDronesData(formattedData);
    } catch (error) {
      console.error(error.message);
      Swal.fire('Error', `Failed to fetch drones: ${error.message}`, 'error');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const usersData = await response.json();
      const usersMap = usersData.reduce((map, user) => {
        map[user._id] = user.companyName;
        return map;
      }, {});

      setUsers(usersMap);
    } catch (error) {
      console.error(error.message);
      Swal.fire('Error', `Failed to fetch users: ${error.message}`, 'error');
    }
  };

  const handleDelete = async (imei) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/drones/delete/${imei}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const responseBody = await response.text();
        Swal.fire('Failed', `Failed to delete drone: ${responseBody}`, 'error');
        throw new Error(`Failed to delete drone: ${responseBody}`);
      }

      fetchDrones(); // Refresh the list after deletion
    } catch (error) {
      console.error(error.message);
      Swal.fire('Error', `Failed to delete drone: ${error.message}`, 'error');
    }
  };

  const handleEdit = (drone) => {
    setSelectedDrone(drone);
    setShowEditPopup(true);
  };

  const toggleAddPopup = () => {
    setShowAddPopup(!showAddPopup);
  };

  const toggleEditPopup = () => {
    setShowEditPopup(!showEditPopup);
  };

  const filteredDrones = dronesData.filter(drone => {
    const searchTermLower = filter.toLowerCase();
    return ['imei', 'drone_name', 'model', 'soc', 'status', 'range', 'assignedUser']
      .some(key => String(drone[key] || '').toLowerCase().includes(searchTermLower));
  });

  // Download function
  const handleDownload = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filteredDrones);
    XLSX.utils.book_append_sheet(wb, ws, 'Drones');
    XLSX.writeFile(wb, 'Drones_Data.xlsx');
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredDrones.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDrones = filteredDrones.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="drone-admin-dashboard">
      {user && user.role === 'admin' ? <AdminSidebar /> : <Sidebar />}
      <div className="drone-main-content">
        <Topbar />
        <div className="drone-drones">
          <div className="drone-drones-header">
            <h2>Manage Drones</h2>
            <div className="drone-search-bar">
              <input
                type="text"
                placeholder="Search"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
              <FaSearch />
              <button className="btn btn-primary" onClick={toggleAddPopup}>
                <FaPlus /> Add
              </button>
              <button className="btn btn-secondary" onClick={handleDownload}>
                Download
              </button>
            </div>
          </div>
          <table className="drone-drones-table">
            <thead>
              <tr>
                <th>IMEI</th>
                <th>Drone Name</th>
                <th>Model / ID</th>
                <th>SOC % (Charge)</th>
                <th>Range (km)</th>
                <th>Status</th>
                <th>Assigned User</th>
                {user && user.role === 'admin' ? <th>Actions</th> : null}
              </tr>
            </thead>
            <tbody>
              {paginatedDrones.map((drone, index) => (
                <tr key={index}>
                  <td>{drone.imei}</td>
                  <td>{drone.drone_name}</td>
                  <td>{drone.model}</td>
                  <td>{drone.soc}</td>
                  <td>{drone.range}</td>
                  <td>
                    {drone.latestData?.p === 1 ? (
                      <span className="drone-status drone-green"></span>
                    ) : (
                      <span className="drone-status drone-red"></span>
                    )}
                    {drone.status}
                  </td>
                  <td>{drone.assignedUser || 'Not Assigned'}</td>
                  {user && user.role === 'admin' ? (
                    <td>
                      <button className="drone-edit-btn" onClick={() => handleEdit(drone)}>Edit</button>
                      <button className="drone-delete-btn" onClick={() => handleDelete(drone.imei)}>Delete</button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
          {showAddPopup && <AddDronePopup onClose={toggleAddPopup} onSave={fetchDrones} />}
          {showEditPopup && selectedDrone && (
            <EditDronePopup onClose={toggleEditPopup} onSave={fetchDrones} drone={selectedDrone} />
          )}
          
          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drones;
