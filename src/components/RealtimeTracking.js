import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';
import lottie from 'lottie-web';
import Sidebar from './Sidebar';
import AdminSidebar from './AdminSidebar';
import './RealtimeTracking.css';
import droneAnimation from '../assets/Animation - 1720863701059.json';

const DroneMarker = ({ lat, lng }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const instance = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: droneAnimation,
      rendererSettings: { preserveAspectRatio: 'xMidYMid slice' }
    });

    return () => instance.destroy();
  }, []);

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div
      ref={containerRef}
      style={{ width: '50px', height: '50px', cursor: 'pointer' }}
      onClick={openInGoogleMaps}
    ></div>
  );
};

const RealtimeTracking = () => {
  const [mapCenter, setMapCenter] = useState({ lat: 10.055554, lng: 76.354738 });
  const [mapZoom, setMapZoom] = useState(14);
  const [dronesData, setDronesData] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const endpoint =
      user && user.role === 'admin'
        ? 'http://localhost:3003/alldronesdata'
        : `http://localhost:3003/dronesdata/${user.username}`;

    fetch(endpoint)
      .then(response => response.json())
      .then(data => setDronesData(data))
      .catch(error => console.error('Error fetching drone data:', error));
  }, [user]);

  const viewMap = (drone) => {
    setMapCenter({ lat: drone.latestData.l, lng: drone.latestData.g });
    setMapZoom(18);
  };

  return (
    <div className="realtime-tracking">
      {user && user.role === 'admin' ? <AdminSidebar /> : <Sidebar />}

      <div className="main-content">
        <div className="map-container">
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyDZXY8oBBXr0QqKgGH4TBzqM019b8lQXpk' }}
            center={mapCenter}
            zoom={mapZoom}
          >
            {dronesData.map(drone => (
              <DroneMarker
                key={drone.id}
                lat={drone.latestData.l}
                lng={drone.latestData.g}
              />
            ))}
          </GoogleMapReact>
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
                    <Link to={`/drone-details/${drone.imei}`} className="details-btn">
                      <i className="fas fa-th-large"></i>
                      <span className="tooltip">Details</span>
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
