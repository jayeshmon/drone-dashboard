import React, { useState, useEffect } from 'react';
import './Drones.css';
import Papa from 'papaparse';
import AddDronePopup from './AddDronePopup';
import EditDronePopup from './EditDronePopup';
import Topbar from './Topbar';
import AdminSidebar from './AdminSidebar';
import Sidebar from './Sidebar';
import Swal from 'sweetalert2';
import { FaPlus, FaDownload, FaSearch } from 'react-icons/fa';

const Drones = () => {
  
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [dronesData, setDronesData] = useState([]);
  const [users, setUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filter, setFilter] = useState('');
  const [selectedDrone, setSelectedDrone] = useState(null);

  useEffect(() => {
    fetchUsers();

 
      fetchDrones();
  
      

  }, []);

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchDrones = async () => {
    try {
      let response = "";
      if (user.role === "admin") {
        response = await fetch(`${process.env.REACT_APP_API_URL}/alldronesdata`);
      } else {
        response = await fetch(`${process.env.REACT_APP_API_URL}/dronesdata/${user.username}`);
      }

      if (!response.ok) {
        Swal.fire('Failed', `Failed to fetch drones: ${response.statusText}`, 'error');
        throw new Error(`Failed to fetch drones: ${response.statusText}`);
      }

      const data = await response.json();
  
      const formattedData = data.map(drone => ({
        ...drone,
        soc: drone.latestData?.MV || 'N/A',
        assignedUser: drone.assignedUser ? users[drone.assignedUser] : 'Not Assigned'
      }
      ));
      
      setDronesData(formattedData);
      console.log('Drones Data:', formattedData); // Debug log
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
        map[user._id] = user.companyName; // Assuming user data has _id and username fields
        return map;
      }, {});

      setUsers(usersMap);
    } catch (error) {
      console.error(error.message);
      Swal.fire('Error', `Failed to fetch users: ${error.message}`, 'error');
    }
    
  };

  const addDrone = async (drone) => {
    try {
      // Remove assignedUser field if it is empty
      if (!drone.assignedUser) {
        delete drone.assignedUser;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/drones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(drone)
      });

      if (!response.ok) {
        const responseBody = await response.text();
        Swal.fire('Failed', `Failed to add drone: ${responseBody}`, 'error');
        throw new Error(`Failed to add drone: ${responseBody}`);
      }

      fetchDrones();
    } catch (error) {
      console.error(error.message);
      Swal.fire('Error', `Failed to add drone: ${error.message}`, 'error');
    }
  };

  const updateDrone = async (id, updatedDrone) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/drones/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedDrone)
      });

      if (!response.ok) {
        const responseBody = await response.text();
        Swal.fire('Failed', `Failed to update drone: ${responseBody}`, 'error');
        throw new Error(`Failed to update drone: ${responseBody}`);
      }

      const updatedData = await response.json();
      setDronesData(prevDrones => 
        prevDrones.map(drone => 
          drone._id === id ? { ...drone, ...updatedDrone, assignedUser: users[updatedDrone.assignedUser] } : drone
        )
      );
    } catch (error) {
      console.error(error.message);
      Swal.fire('Error', `Failed to update drone: ${error.message}`, 'error');
    }
  };

  const deleteDrone = async (imei) => {
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

      fetchDrones();
    } catch (error) {
      console.error(error.message);
      Swal.fire('Error', `Failed to delete drone: ${error.message}`, 'error');
    }
  };

  const sortedDrones = React.useMemo(() => {
    let sortableDrones = [...dronesData];
    if (sortConfig !== null) {
      sortableDrones.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableDrones;
  }, [dronesData, sortConfig]);

  const filteredDrones = sortedDrones.filter(drone => {
    const searchTermLower = filter.toLowerCase();

    const imeiMatch = String(drone.imei).toLowerCase().includes(searchTermLower);
    const nameMatch = String(drone.drone_name).toLowerCase().includes(searchTermLower);
    const modelMatch = String(drone.model).toLowerCase().includes(searchTermLower);
    const socMatch = String(drone.soc).toLowerCase().includes(searchTermLower);
    const statusMatch = String(drone.status).toLowerCase().includes(searchTermLower);
    const rangeMatch = String(drone.range).toLowerCase().includes(searchTermLower);
    const assignedUserMatch = String(drone.assignedUser || '').toLowerCase().includes(searchTermLower);

    return imeiMatch || nameMatch || modelMatch || socMatch || statusMatch || rangeMatch || assignedUserMatch;
  });

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const toggleAddPopup = () => {
    setShowAddPopup(!showAddPopup);
  };

  const toggleEditPopup = (drone) => {
    setSelectedDrone(drone);
    setShowEditPopup(!showEditPopup);
  };

  const handleFileUpload = event => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: results => {
          const newDrones = results.data.map(row => ({
            imei: row['IMEI'] || '', // Handle undefined values
            drone_name: row['Drone Name'] || '',
            model: row['Model / ID'] || '',
            soc: row['SOC % (Charge)'] || 'N/A',
            range: row['Range (km)'] || '', // Add range field
            assignedUser: '' // Leave assignedUser empty, will be edited later
          }));

          newDrones.forEach(drone => {
            if (drone.imei && drone.drone_name && drone.model) { // Basic validation to ensure required fields are present
              addDrone(drone);
            } else {
              console.warn("Invalid drone data:", drone); // Log invalid data for debugging
            }
          });
        },
      });
    }
  };

  const handleDownloadSampleFile = () => {
    const sampleData = [
      ['IMEI', 'Drone Name', 'Model / ID', 'SOC % (Charge)', 'Range (km)', 'Status'],
      [123456789012345, 'Drone A', 'Model X', 100, 20, 'Active'], // IMEI as number
      [987654321098765, 'Drone B', 'Model Y', 75, 15, 'Inactive'], // IMEI as number
    ];

    const csvContent = sampleData.map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "drone_sample.csv";
    link.click();
  };

  const handleDelete = (imei) => {
    if (imei) {
      deleteDrone(imei);
    } else {
      console.error('Drone ID is undefined');
    }
  };

  const handleEdit = (drone) => {
    toggleEditPopup(drone);
  };

  const handleDownloadClick = () => {
    const csvData = dronesData.map(drone => ({
      IMEI: drone.imei,
      Name: drone.drone_name,
      Model: drone.model,
      SOC: drone.soc,
      Range: drone.range,
      Status: drone.status,
      AssignedUser: drone.assignedUser || ''
    }));

    const csvContent = [
      ['IMEI', 'Name', 'Model', 'SOC', 'Range', 'Status', 'AssignedUser'],
      ...csvData.map(item => [item.IMEI, item.Name, item.Model, item.SOC, item.Range, item.Status, item.AssignedUser])
    ]
      .map(e => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "drones.csv";
    link.click();
  };

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
              <button className="btn btn-secondary" onClick={handleDownloadClick}>
                <FaDownload /> Download
              </button>
              <button className="btn btn-secondary" onClick={handleDownloadSampleFile}>
                Download Sample File
              </button>
              <label className="btn btn-secondary">
                Upload Drones
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
          <table className="drone-drones-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('imei')}>IMEI</th>
                <th onClick={() => requestSort('drone_name')}>Drone Name</th>
                <th onClick={() => requestSort('model')}>Model / ID</th>
                <th onClick={() => requestSort('soc')}>SOC % (Charge)</th>
                <th onClick={() => requestSort('range')}>Range (km)</th>
                <th onClick={() => requestSort('status')}>Status</th>
                <th onClick={() => requestSort('assignedUser')}>Assigned User</th>
                {user && user.role === 'admin' ? (
                  <th>Actions</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {filteredDrones.map((drone, index) => (
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
                      <button
                        className="drone-edit-btn"
                        onClick={() => handleEdit(drone)}
                      >
                        Edit
                      </button>
                      <button
                        className="drone-delete-btn"
                        onClick={() => handleDelete(drone.imei)}
                      >
                        Delete
                      </button>
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
        </div>
      </div>
    </div>
  );
};

export default Drones;



