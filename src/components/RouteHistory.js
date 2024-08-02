import React, { useState } from 'react';
import { GoogleMap, Polyline, LoadScript } from '@react-google-maps/api';
import Swal from 'sweetalert2';
import './RouteHistory.css'; // Ensure to create this CSS file for styling

const mapContainerStyle = {
  height: '500px',
  width: '100%',
};

const RouteHistory = () => {
  const [form, setForm] = useState({
    imei: '',
    fromDate: '',
    toDate: '',
  });
  const [mapData, setMapData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleReset = () => {
    setForm({
      imei: '',
      fromDate: '',
      toDate: '',
    });
    setMapData([]);
    setMapCenter({ lat: 0, lng: 0 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { imei, fromDate, toDate } = form;
    if (imei && fromDate && toDate) {
      fetch(`http://localhost:3003/dronedatabydate/${imei}/${fromDate}/${toDate}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch route history');
          }
          return response.json();
        })
        .then((data) => {
          setMapData(data);
          console.log(data[0].l);
          if (data.length > 0) {
            setMapCenter({ lat:data[0].l, lng: data[0].g });
          } else {
            setMapCenter({ lat: 0, lng: 0 }); // Optional: set to a default or previous center
          }
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
        text: 'Please provide IMEI, From Date, and To Date.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="route-history-container">
      <h3>Route History</h3>
      <form onSubmit={handleSubmit} className="route-history-form">
        <div className="form-group">
          <label htmlFor="imei">IMEI</label>
          <input
            type="text"
            className="form-control"
            id="imei"
            name="imei"
            value={form.imei}
            onChange={handleChange}
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
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Submit</button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
        </div>
      </form>
      <div className="map-container mt-4">
        
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={8}
          >
            <Polyline
              path={mapData.map(location => ({ lat: location.l, lng: location.g }))}
              options={{
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
              }}
            />
          </GoogleMap>
        
      </div>
    </div>
  );
};

export default RouteHistory;
