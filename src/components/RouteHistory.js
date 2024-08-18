import React, { useState } from 'react';
import { GoogleMap, Polyline, LoadScript } from '@react-google-maps/api';
import Swal from 'sweetalert2';
import './RouteHistory.css'; // Ensure this CSS file is present

const mapContainerStyle = {
  height: '500px',
  width: '100%',
};

const RouteHistory = () => {
  const [imei, setImei] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [mapData, setMapData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

  const fetchData = () => {
    if (imei && startDate && endDate) {
      fetch(`${process.env.REACT_APP_API_URL}/dronedatabydate/${imei}/${startDate}/${endDate}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch route history');
          }
          return response.json();
        })
        .then((data) => {
          // Validate and log the fetched data
          console.log('Fetched data:', data);
         
            setMapCenter({ lat: parseFloat(data[0].l), lng: parseFloat(data[0].g) });
          setMapData(data);
        })
        .catch((error) => {
          Swal.fire({
            title: 'Error!',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        });
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Please provide IMEI, Start Date, and End Date.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="route-history-container">
      <h3>Route History</h3>
      <div className="route-history-form">
        <div className="form-group">
          <label htmlFor="imei">IMEI</label>
          <input
            type="text"
            readOnly="true"
            id="imei"
            value={imei}
            onChange={(e) => setImei(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Start Date & Time</label>
          <input
            type="datetime-local"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date & Time</label>
          <input
            type="datetime-local"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={fetchData}>
          Load Route History
        </button>
      </div>

      <div className="map-container mt-4">
        
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={30}
          >
            {mapData.length > 0 && (
              <Polyline
                path={mapData.map((location) => ({ lat: parseFloat(location.l), lng: parseFloat(location.g) }))}
                options={{
                  strokeColor: '#FF0000',
                  strokeOpacity: 1.0,
                  strokeWeight: 2,
                }}
              />
            )}
          </GoogleMap>
        
      </div>
    </div>
  );
};

export default RouteHistory;
