import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FlightIcon from '@mui/icons-material/Flight';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import SpeedIcon from '@mui/icons-material/Speed';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PublicIcon from '@mui/icons-material/Public';
import RoadIcon from '@mui/icons-material/Directions';
import Sidebar from './Sidebar';
import { GoogleMap, Marker } from '@react-google-maps/api';
import './DroneDetails.css';

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
  const [mapData, setMapData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    const imei = window.location.href.split('/').pop();

    fetch(`http://localhost:3003/dronedata/${imei}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setDrone(data);
        setForm(prevForm => ({ ...prevForm, imei: data.imei, deviceName: data.drone_name }));
        setMapCenter({
          lat: data.latestData.l,
          lng: data.latestData.g
        });
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [droneId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleReset = () => {
    setForm({
      imei: drone ? drone.imei : '',
      deviceName: drone ? drone.drone_name : '',
      fromDate: '',
      toDate: ''
    });
    setMapData([]);
    setMapCenter({ lat: drone ? drone.latestData.l : 0, lng: drone ? drone.latestData.g : 0 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', form);
    // Fetch route history based on the form data and update mapData
    // Example: fetch(`http://localhost:3003/routehistory?imei=${form.imei}&from=${form.fromDate}&to=${form.toDate}`)
    // .then(response => response.json())
    // .then(data => {
    //   setMapData(data.routes);
    // });
  };

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
          <p>{/* Date & Time Filter */}</p>
        </div>
      </div>

      {/* Route History Section */}
      <div className="route-history mt-4">
        <h3>Route History</h3>
        <form onSubmit={handleSubmit} className="route-history-form">
          <div className="input-group">
            <div className="form-group">
              <label htmlFor="imei">IMEI</label>
              <input
                type="text"
                className="form-control"
                id="imei"
                name="imei"
                value={form.imei}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="deviceName">Device Name</label>
              <input
                type="text"
                className="form-control"
                id="deviceName"
                name="deviceName"
                value={form.deviceName}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="fromDate">From Date & Time</label>
              <input
                type="datetime-local"
                className="form-control"
                id="fromDate"
                name="fromDate"
                value={form.fromDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="toDate">To Date & Time</label>
              <input
                type="datetime-local"
                className="form-control"
                id="toDate"
                name="toDate"
                value={form.toDate}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
          </div>
        </form>
        <div className="map-container mt-4">
          
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '400px' }}
              center={mapCenter}
              zoom={12}
            >
              {mapData.map((location, index) => (
                <Marker key={index} position={{ lat: location.lat, lng: location.lng }} />
              ))}
            </GoogleMap>
          
        </div>
      </div>
    </div>
  );
};

export default DroneDetails;
