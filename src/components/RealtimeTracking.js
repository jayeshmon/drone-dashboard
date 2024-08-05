import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminSidebar from './AdminSidebar';
import './RealtimeTracking.css';
import MapComponent from './MapComponent';

const RealtimeTracking = () => {
  const [dronesData, setDronesData] = useState([]);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [zoom, setZoom] = useState(10);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    
    const endpoint =
      user && user.role === 'admin'
        ? 'http://dashboard.fuselage.co.in:3003/alldronesdata'
        : `http://dashboard.fuselage.co.in:3003/dronesdata/${user.username}`;

    fetch(endpoint)
      .then(response => response.json())
      .then(data => setDronesData(data))
      .catch(error => console.error('Error fetching drone data:', error));
  }, [user]);

  const viewMap = (drone) => {
  
    const droneLat = parseFloat(drone.latestData.l);
    const droneLng = parseFloat(drone.latestData.g);
    setLat(droneLat);
    setLng(droneLng);
    setZoom(12)
   
      

    
  };

  return (
    <div className="realtime-tracking">
      {user && user.role === 'admin' ? <AdminSidebar /> : <Sidebar />}

      <div className="main-content">
        <div className="map-container">
          <MapComponent 
            lat={lat} 
            lng={lng} 
            zoom={zoom} 
          />
        </div>
        <div className="drone-status-table">
          <div className="table-header">
            <div className="table-actions">
              <button className="download-btn"><i className="fas fa-download"></i></button>
              <input type="text" placeholder="Search" className="search-input" />
              <select className="filter-select">
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Sl No</th>
                <th>IMEI</th>
                <th>Drone Name</th>
                <th>Model / ID</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dronesData.map((drone, index) => (
                <tr key={drone.id}> {/* Ensure each row has a unique key */}
                  <td>{index + 1}</td>
                  <td>{drone.imei}</td>
                  <td>{drone.drone_name}</td>
                  <td>{drone.model}</td>
                  <td>
                    <span className={`status ${drone.latestData.p === 1 ? 'active' : 'inactive'}`}>
                      {drone.latestData.p === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="view-map-btn" onClick={() => viewMap(drone)}>View Map</button>
                    <Link to={`/drone-details/${drone.imei}`} className="detailed-view-btn">
                      Detailed View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RealtimeTracking;
