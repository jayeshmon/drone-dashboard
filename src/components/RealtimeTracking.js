import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';
import './RealtimeTracking.css';
import lottie from 'lottie-web';
import droneAnimation from '../assets/Animation - 1720863701059.json';
import Sidebar from './Sidebar';

const dronesData = [
    { id: 1, imei: '860305052252030', name: 'DJI Matrice 600', model: 'C294753', status: 'Active', lat: 10.055554, lng: 76.354738 },
    { id: 2, imei: '860305052252031', name: 'DJI Mavic Enterprise', model: 'C293841', status: 'Active', lat: 10.0258421, lng: 76.3924477 },
    { id: 3, imei: '860305052252032', name: 'x1', model: 'C393748', status: 'Inactive', lat: 9.989359, lng: 76.356552 },
    { id: 4, imei: '860305052252033', name: 'x1', model: 'C395832', status: 'Active', lat: 9.974817, lng: 76.282960 },
    { id: 5, imei: '860305052252034', name: 'Scan Eagle', model: 'C293843', status: 'Inactive', lat: 9.988491, lng: 76.579269 },
    { id: 6, imei: '860305052252035', name: 'xFrame 20', model: 'C393848', status: 'Active', lat: 10.044599, lng: 76.3645901 },
    { id: 7, imei: '860305052252036', name: 'xFrame 50', model: 'C293586', status: 'Active', lat: 10.0954962, lng: 77.0465818 },
    { id: 8, imei: '860305052252037', name: 'xFrame 50', model: 'C929572', status: 'Active', lat: 9.745635, lng: 77.121254 },
    { id: 9, imei: '860305052252038', name: 'xFrame 10H', model: 'C672731', status: 'Inactive', lat: 9.135797, lng: 76.839856 }
  ];
  
<Sidebar/>
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
  const navigate = useNavigate();

  const viewMap = (drone) => {
    setMapCenter({ lat: drone.lat, lng: drone.lng });
    setMapZoom(18);
  };

  const openDetailsPage = (droneId) => {
    navigate(`/drone-details/${droneId}`);
  };

  return (
    <div className="realtime-tracking">
      <div className="map-container">
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyDZXY8oBBXr0QqKgGH4TBzqM019b8lQXpk' }}
          center={mapCenter}
          zoom={mapZoom}
        >
          {dronesData.map(drone => (
            <DroneMarker
              key={drone.id}
              lat={drone.lat}
              lng={drone.lng}
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
                <td>{drone.name}</td>
                <td>{drone.model}</td>
                <td><span className={`status ${drone.status === 'Active' ? 'green' : 'red'}`}></span> {drone.status}</td>
                <td>
                  <button className="view-map-btn" onClick={() => viewMap(drone)}>View Map</button>
                  <button className="more-details-btn" onClick={() => openDetailsPage(drone.id)}>More Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RealtimeTracking;
