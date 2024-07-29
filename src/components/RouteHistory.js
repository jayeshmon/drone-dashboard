import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import './RouteHistory.css';
import DeviceIcon from '@mui/icons-material/Devices';
import IMEIIcon from '@mui/icons-material/Tag';
import DateRangeIcon from '@mui/icons-material/DateRange';
import Swal from 'sweetalert2';
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

const RouteHistory = () => {
  const [device, setDevice] = useState('');
  const [imei, setImei] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleDeviceChange = (e) => {
    const selectedDevice = e.target.value;
    setDevice(selectedDevice);
    // Autofill IMEI based on selected device
    const selectedDrone = dronesData.find(d => d.name === selectedDevice);
    setImei(selectedDrone ? selectedDrone.imei : '');
  };

  return (
    <div className="route-history">
      <h2>Route History</h2>
      <div className="route-history-form">
        <div className="form-group">
          <DeviceIcon />
          <input
            type="text"
            placeholder="Device Name / Model"
            value={device}
            onChange={handleDeviceChange}
            list="devices"
          />
          <datalist id="devices">
            {dronesData.map((drone, index) => (
              <option key={index} value={drone.name} />
            ))}
          </datalist>
        </div>
        <div className="form-group">
          <IMEIIcon />
          <input
            type="text"
            placeholder="IMEI"
            value={imei}
            readOnly
          />
        </div>
        <div className="form-group">
          <DateRangeIcon />
          <input
            type="datetime-local"
            placeholder="From Date & Time"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <DateRangeIcon />
          <input
            type="datetime-local"
            placeholder="To Date & Time"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <div className="map-container">
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'YOUR_GOOGLE_MAPS_API_KEY' }}
          defaultCenter={{ lat: 10.055554, lng: 76.354738 }}
          defaultZoom={10}
        >
          {/* Add route markers here */}
        </GoogleMapReact>
      </div>
    </div>
  );
};

export default RouteHistory;
