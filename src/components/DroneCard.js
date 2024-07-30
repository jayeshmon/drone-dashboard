import React, { useState, useEffect } from 'react';
import './DroneCard.css';
import droneIcon1 from '../assets/drone1.png';
import droneIcon2 from '../assets/drone2.png';
import droneIcon3 from '../assets/drone3.png';
import Swal from 'sweetalert2';

const DroneCard = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [droneData, setDroneData] = useState([]);

  useEffect(() => {
    const fetchDroneData = () => {
      try {
        const storedData = localStorage.getItem('droneData');
        if (storedData) {
          const data = JSON.parse(storedData);
          setDroneData(data);
        } else {
          Swal.fire('No drone data found in local storage', '', 'warning');
        }
      } catch (err) {
        console.error('Error fetching drone data:', err.message);
        Swal.fire('Error', 'Error fetching drone data: ' + err.message, 'error');
      }
    };

    fetchDroneData();
  }, []);

  const filteredDrones = droneData.filter(drone => {
    const pStatus = drone.latestData?.p;
    return (filter === 'All' ||
            (filter === 'Active' && pStatus === 1) ||
            (filter === 'Inactive' && (pStatus === 0 || pStatus === null || pStatus === undefined))) &&
           (drone.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
            drone.id?.toLowerCase().includes(searchTerm.toLowerCase()));
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
                  <h5 className="drone-model">{drone.drone_name}</h5>
                  <p className="drone-id">{drone.model}</p>
                 
                </div>
                <img src={drone.icon || droneIcon1} alt="drone icon" className="drone-icon" />
              </div>
              <div className="drone-status">
                <div className="status-item">
                  <p className="status-label">imei:</p>
                  <p className="status-value">{drone.imei}</p>
                </div>
                <div className="status-item">
                  <p className="status-label">Status:</p>
                  <p className="status-value">{drone.latestData.p==1?"Active":"Inactive"}</p>
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
