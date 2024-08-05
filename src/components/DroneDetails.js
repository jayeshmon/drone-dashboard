import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FlightIcon from '@mui/icons-material/Flight';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import SpeedIcon from '@mui/icons-material/Speed';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PublicIcon from '@mui/icons-material/Public';
import RoadIcon from '@mui/icons-material/Directions';
import Sidebar from './Sidebar';

import './DroneDetails.css';
import RouteHistory from './RouteHistory';

const DroneDetails = () => {
  const { droneId } = useParams();
  const navigate = useNavigate();
  const [drone, setDrone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    imei: '',
    deviceName: '',
    fromDate: '',
    toDate: ''
  });
 

  useEffect(() => {
    const imei = window.location.href.split('/').pop();

    fetch(`http://dashboard.fuselage.co.in:3003/dronedata/${imei}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setDrone(data);
        setForm(prevForm => ({ ...prevForm, imei: data.imei, deviceName: data.drone_name }));
       
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [droneId]);

  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!drone) {
    return <div>Drone not found</div>;
  }

  return (
    <div className="drone-details">
      <Sidebar />
      <div className="details-header">
        <button className="back-button" onClick={() => navigate(-1)}>&larr; Back</button>
        <h2>{drone.drone_name} / {drone.model}</h2>
      </div>
      <div className="details-body">
        <div className="card flight-mode">
          <FlightIcon className="card-icon" />
          <h3>{drone.latestData.p === 1 ? "Manual" : "AB Mode"}</h3>
        </div>
        <div className="card battery-status">
          <BatteryFullIcon className="card-icon" />
          <h3>Battery Status</h3>
          <p>Connected, SOC {drone.latestData.MV}%</p>
        </div>
        <div className="card altitude-speed">
          <SpeedIcon className="card-icon" />
          <h3>Altitude</h3>
          <p>{drone.latestData.ALT}</p>
        </div>
        <div className="card speed">
          <SpeedIcon className="card-icon" />
          <h3>Speed</h3>
          <p>{drone.latestData.s}</p>
        </div>
        <div className="card location">
          <LocationOnIcon className="card-icon" />
          <h3>Location</h3>
          <p>Latitude: {drone.latestData.l} Longitude: {drone.latestData.g}</p>
        </div>
        <div className="card trip">
          <RoadIcon className="card-icon" />
          <h3>Total Hours</h3>
          <p>{/* Value */}</p>
        </div>
        <div className="card total-area">
          <PublicIcon className="card-icon" />
          <h3>Total Area Covered</h3>
          
        </div>
      </div>
      <RouteHistory/>
  </div>
  
  
  );
};

export default DroneDetails;
