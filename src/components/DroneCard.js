import React, { useState, useEffect } from 'react';
import './DroneCard.css';
import droneIcon1 from '../assets/drone1.png';
import droneIcon2 from '../assets/drone2.png';
import droneIcon3 from '../assets/drone3.png';
import Swal from 'sweetalert2';
const defaultDroneData = [
  { id: 'C294753', model: 'DJI Matrice 600', imei: '860305052252030', Status: 'Active', battery: 62, maxKm: 260, icon: droneIcon1 },
  { id: 'C293841', model: 'DJI Mavic Enterprise', imei: '860305052252025', Status: 'Active', battery: 44, maxKm: 139, icon: droneIcon2 },
  { id: 'C393748', model: 'x1', imei: '860305052252054', Status: 'Active', battery: 71, maxKm: 210, icon: droneIcon3 },
  { id: 'C395832', model: 'x1', imei: '860305052252055', Status: 'Inactive', battery: 71, maxKm: 240, icon: droneIcon1 },
  { id: 'C293843', model: 'Scan Eagle', imei: '860305052252056', Status: 'Inactive', battery: 92, maxKm: 900, icon: droneIcon2 },
  { id: 'C393848', model: 'xFrame 20', imei: '860305052252057', Status: 'Active', battery: 92, maxKm: 900, icon: droneIcon3 },
  { id: 'C293586', model: 'xFrame 50', imei: '860305052252058', Status: 'Active', battery: 70, maxKm: 5, icon: droneIcon1 },
  { id: 'C929572', model: 'xFrame 50', imei: '860305052252059', Status: 'Active', battery: 92, maxKm: 5, icon: droneIcon2 },
  { id: 'C672731', model: 'xFrame 10H', imei: '860305052252050', Status: 'Inactive', battery: 92, maxKm: 5, icon: droneIcon3 }
];

const DroneCard = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [droneData, setDroneData] = useState(defaultDroneData); // Initialize with default data

  useEffect(() => {
    const fetchDroneData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          throw new Error('User not logged in');
        }
        
        const token = localStorage.getItem('token'); // Assume token is stored in localStorage
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        
        let response;
        if (user.role === 'admin') {
          response = await fetch('http://localhost:3003/drones', { headers });
        } else {
          response = await fetch(`http://localhost:3003/drones?username=${user.username}`, { headers });
        }
        
        if (response.ok) {
         
          const data = await response.json();
          console.log(data);
          setDroneData(data);

        } else {
          const error = await response.text();
          console.error('Error fetching drone data:', error);
          alert('Error fetching drone data: ' + error);
        }
      } catch (err) {
        console.error('Error:', err.message);
        alert('Error: ' + err.message);
      }
    };

    fetchDroneData();
  }, []);

  const filteredDrones = droneData.filter(drone => {
    return (filter === 'All' || drone.Status === filter) &&
           (drone.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
            drone.id.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="drone-card-component container-fluid">
      <div className="filter-bar row">
        <div className="col-6">
          <select className="form-select" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="All">All Drones</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="col-6">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by name or ID" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>
      <div className="dronecard row">
        {filteredDrones.map((drone, index) => (
          <div key={index} className="drone-card col-12 col-md-6 col-lg-4">
            <div className="dronecard-content">
              <div className="drone-header">
                <div className="drone-info">
                  <h5 className="drone-model">{drone.model}</h5>
                  <p className="drone-id">{drone.id}</p>
                </div>
                <img src={drone.icon} alt="drone icon" className="drone-icon" />
              </div>
              <div className="drone-status">
                <div className="status-item">
                  <p className="status-label">imei:</p>
                  <p className="status-value">{drone.imei}</p>
                </div>
                <div className="status-item">
                  <p className="status-label">Status:</p>
                  <p className="status-value">{drone.Status}</p>
                </div>
              </div>
              <div className="battery-section">
                <p>Battery</p>
                <div className="battery-bar">
                  <div className="battery-level" style={{ width: `${drone.battery}%` }}></div>
                </div>
                <div className="battery-info">
                  <p className="battery-percentage">{drone.battery}%</p>
                  <p className="battery-max">Max: {drone.maxKm} miles</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DroneCard;
