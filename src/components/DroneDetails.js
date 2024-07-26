import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FlightIcon from '@mui/icons-material/Flight';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import SpeedIcon from '@mui/icons-material/Speed';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PublicIcon from '@mui/icons-material/Public';
import RoadIcon from '@mui/icons-material/Directions';

import './DroneDetails.css';
import RouteHistory from './RouteHistory';

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

const DroneDetails = () => {
  const { droneId } = useParams();
  const navigate = useNavigate();
  const drone = dronesData.find(d => d.id === parseInt(droneId));

  if (!drone) {
    return <div>Drone not found</div>;
  }

  return (
    <div className="drone-details">
      <div className="details-header">
        <button className="back-button" onClick={() => navigate(-1)}>&larr; Back</button>
        <h2>{drone.name} / {drone.model}</h2>
      </div>
      <div className="details-body">
        <div className="card flight-mode">
          <FlightIcon className="card-icon" />
          <h3>Flight Mode</h3>
          <p>Manual</p>
        </div>
        <div className="card battery-status">
          <BatteryFullIcon className="card-icon" />
          <h3>Battery Status</h3>
          <p>Connected, SOC {drone.soc}%</p>
        </div>
        <div className="card altitude-speed">
          <SpeedIcon className="card-icon" />
          <h3>Altitude</h3>
          <p>Altitude: <span>{/* Value */}</span> Speed: <span>{/* Value */}</span></p>
        </div>
        <div className="card altitude-speed">
          <SpeedIcon className="card-icon" />
          <h3>Speed</h3>
          <p>Altitude: <span>{/* Value */}</span> Speed: <span>{/* Value */}</span></p>
        </div>
        <div className="card location">
          <LocationOnIcon className="card-icon" />
          <h3>Location</h3>
          <p>Latitude: {drone.lat} Longitude: {drone.lng}</p>
        </div>
        <div className="card trip">
          <RoadIcon className="card-icon" />
          <h3>Total Hours</h3>
          <p>{/* Value */}</p>
        </div>
        <div className="card total-area">
          <PublicIcon className="card-icon" />
          <h3>Total Area Covered</h3>
          <p>{/* Date & Time Filter */}</p>
        </div>
      </div>
      <RouteHistory />
    </div>
  );
};

export default DroneDetails;
