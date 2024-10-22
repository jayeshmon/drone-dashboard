import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminSidebar from './AdminSidebar';
import './RealtimeTracking.css';
import MapComponent from './MapComponent';

const RealtimeTracking = () => {
  const [dronesData, setDronesData] = useState([]);
  const [filteredDronesData, setFilteredDronesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedDrone, setSelectedDrone] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const endpoint =
      user && user.role === 'admin'
        ? `${process.env.REACT_APP_API_URL}/alldronesdata`
        : `${process.env.REACT_APP_API_URL}/dronesdata/${user.username}`;

    fetch(endpoint)
      .then(response => response.json())
      .then(data => {
        setDronesData(data);
        setFilteredDronesData(data);
      })
      .catch(error => console.error('Error fetching drone data:', error));
  }, [user]);

  useEffect(() => {
    let filteredData = dronesData;

    if (filterStatus !== 'All') {
      const isActive = filterStatus === 'Active';
      filteredData = filteredData.filter(drone => drone.latestData.p === (isActive ? 1 : 0));
    }

    if (searchTerm) {
      filteredData = filteredData.filter(drone =>
        drone.drone_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drone.imei.includes(searchTerm)
      );
    }

    setFilteredDronesData(filteredData);
  }, [searchTerm, filterStatus, dronesData]);

  const viewMap = (drone) => {
    setSelectedDrone(drone);
  };

  return (
    <div className="realtime-tracking">
      {user && user.role === 'admin' ? <AdminSidebar /> : <Sidebar />}

      <div className="main-content">
        <div className="map-container">
          {selectedDrone ? (
            <MapComponent
              lat={parseFloat(selectedDrone?.latestData?.l?.split(',')[selectedDrone?.latestData.l?.split(',').length-1]) ? parseFloat(selectedDrone.latestData.l?.split(',')[selectedDrone?.latestData?.l?.split(',').length-1]) :  0.00}
              lng={parseFloat(selectedDrone?.latestData?.g?.split(',')[selectedDrone?.latestData.g?.split(',').length-1]) ?  parseFloat(selectedDrone.latestData.g?.split(',')[selectedDrone?.latestData?.g?.split(',').length-1]) : 0.00 }
              zoom={25}
              drone={selectedDrone}
            />
          ) : (
            <p>Select a drone to view its location on the map</p>
          )}
        </div>
        <div className="drone-status-table">
          <div className="table-header">
            <div className="table-actions">
              <input
                type="text"
                placeholder="Search by Drone Name or IMEI"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <table className="styled-table">
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
              {filteredDronesData.map((drone, index) => (
                <tr key={drone.id}>
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
