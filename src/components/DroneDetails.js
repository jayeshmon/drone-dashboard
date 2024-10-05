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
  const [totalArea, setTotalArea] = useState(null); // State for total area covered
  const [totalHours, setTotalHours] = useState(null); // State for total hours

  const [form, setForm] = useState({
    imei: '',
    deviceName: '',
    fromDate: '',
    toDate: ''
  });

  useEffect(() => {
    const imei = window.location.href.split('/').pop();
    console.log('Extracted IMEI:', imei); // Debugging IMEI extraction

    // Fetch drone data
    fetch(`${process.env.REACT_APP_API_URL}/dronedata/${imei}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Drone data:', data); // Log drone data to verify structure
        setDrone(data);
        setForm(prevForm => ({
          ...prevForm,
          imei: data.imei,
          deviceName: data.drone_name
        }));
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });

    // Fetch total area covered
    fetch(`${process.env.REACT_APP_API_URL}/trip/${imei}/km`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch total area covered');
        }
        
        return response.json();
      })
      .then(data => {
        console.log('Total area covered data:', data); // Debug response from total area covered API
        console.log("************")
        console.log(data)
        console.log("************")
        if (data.kmCovered) {
          setTotalArea(data.kmCovered); // Set total area covered state
        } else {
          setTotalArea(0); // Set default value if no area covered is returned
        }
      })
      .catch(error => {
        console.error('Error fetching total area covered:', error);
      });

    // Fetch total hours (if available via another API)
    // fetch(`${process.env.REACT_APP_API_URL}/total-hours/${imei}`)
    //   .then(response => response.json())
    //   .then(data => {
    //     setTotalHours(data.totalHours); // Set the total hours in the state
    //   })
    //   .catch(error => {
    //     console.error('Error fetching total hours:', error);
    //   });
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
          <p>Latitude: {drone.latestData.l.split(',')[drone.latestData.l.split(',').length-1]} Longitude: {drone.latestData.g.split(',')[drone.latestData.g.split(',').length-1]}</p>
        </div>
        <div className="card trip">
          <RoadIcon className="card-icon" />
          <h3>Total Hours</h3>
          <p>{totalHours ? `${totalHours} hrs` : 'Loading...'}</p> {/* Display total hours if fetched */}
        </div>
        <div className="card total-area">
          <PublicIcon className="card-icon" />
          <h3>Total Area Covered</h3>
          <p>{totalArea !== null ? `${totalArea} Acres` : 'Loading...'}</p> {/* Display total area covered */}
        </div>
      </div>
      <RouteHistory imei={drone.imei} />
    </div>
  );
};

export default DroneDetails;
