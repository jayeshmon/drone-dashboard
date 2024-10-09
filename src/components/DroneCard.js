import React, { useState, useEffect } from 'react';
import './DroneCard.css';
import droneIcon1 from '../assets/drone1.png';
import Swal from 'sweetalert2';

const DroneCard = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [droneData, setDroneData] = useState([]);

  const fetchDroneData = () => {
    try {
      const storedData = localStorage.getItem('droneData');
      if (storedData) {
        const data = JSON.parse(storedData);
        setDroneData(data);
      } else {
        //Swal.fire('No drone data found in local storage', '', 'warning');
      }
    } catch (err) {
      console.error('Error fetching drone data:', err.message);
      Swal.fire('Error', 'Error fetching drone data: ' + err.message, 'error');
    }
  };

  useEffect(() => {
    // Fetch data initially
    fetchDroneData();

    // Set interval to fetch data every 10 seconds
    const intervalId = setInterval(fetchDroneData, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const filteredDrones = droneData.filter(drone => {
    const pStatus = drone.latestData?.p;
    return (filter === 'All' ||
            (filter === 'Active' && pStatus === 1) ||
            (filter === 'Inactive' && (pStatus === 0 || pStatus == null))) &&
           (drone.drone_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            drone.imei?.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="flight-card-component container-fluid">
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
            placeholder="Search by name or IMEI" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>
      <div className="row">
        {filteredDrones.map((drone, index) => (
          <div key={index} className="flight-card col-12 col-md-6 col-lg-4">
            <div className="flightcard-content">
              <div className="flight-header">
                <div className="flight-info">
                  <h5 className="flight-name">{drone.drone_name}</h5>
                  <p className="flight-model">{drone.model}</p>
                </div>
                <img src={drone.icon || droneIcon1} alt="drone icon" className="flight-icon" />
              </div>
              <div className="flight-status">
                <div className="status-item">
                  <p className="status-label">IMEI:</p>
                  <p className="status-value">{drone.imei}</p>
                </div>
                <div className="status-item">
                  <p className="status-label">Status:</p>
                  <p className="status-value">{drone.latestData?.p === 1 ? "Active" : "Inactive"}</p>
                </div>
              </div>
              <div className="battery-section">
                <p>Battery</p>
                <div className="battery-bar">
                  <div className="battery-level" style={{ width: `${drone.latestData?.MV || 0}%` }}></div>
                </div>
                <div className="battery-info">
                  <p className="battery-percentage">{drone.latestData?.MV || 0}%</p>
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
