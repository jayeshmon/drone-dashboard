import React, { useState } from 'react';
import './RawData.css'; // Import the CSS file for RawData
import Swal from 'sweetalert2';
import { FaSearch } from 'react-icons/fa';
import * as XLSX from 'xlsx'; // For download functionality
import Topbar from './Topbar'; // Import Topbar for the header
import AdminSidebar from './AdminSidebar'; // Import AdminSidebar for the sidebar

const RawData = () => {
  const [imei, setImei] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [droneData, setDroneData] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch drone data
  const fetchDroneData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/dronedatabydate/${imei}/${startTime}/${endTime}`);
      if (!response.ok) {
        throw new Error('Failed to fetch drone data');
      }
      const data = await response.json();
      console.log(data);
      setDroneData(data);
    } catch (err) {
      setError(err.message);
      Swal.fire('Error', err.message, 'error');
    }
    setLoading(false);
  };

  // Download function
  const handleDownload = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(droneData);
    XLSX.utils.book_append_sheet(wb, ws, 'RawData');
    XLSX.writeFile(wb, 'Raw_Data.xlsx');
  };

  // Clear filters function
  const clearFilters = () => {
    setImei('');
    setStartTime('');
    setEndTime('');
    setFilter('');
    setDroneData([]);
  };

  // Filter drone data based on search input
  const filteredData = droneData.filter(drone => {
    const searchTermLower = filter.toLowerCase();
    return Object.values(drone).some(value =>
      String(value || '').toLowerCase().includes(searchTermLower)
    );
  });

  // Dynamically get table headers based on the keys from droneData
  const getTableHeaders = () => {
    if (droneData.length > 0) {
      return Object.keys(droneData[0]);
    }
    return ['IMEI', 'Timestamp', 'Location', 'Other Field']; // Default headers if no data
  };

  return (
    <div className="rawdata-admin-dashboard">
      <AdminSidebar /> {/* Add AdminSidebar on the left */}
      <div className="rawdata-main-content">
        <Topbar /> {/* Add Topbar (header) */}
        <div className="rawdata-container">
          <div className="rawdata-header">
            <h2>Fetch Raw Drone Data</h2>
            <div className="rawdata-search-bar">
              <input
                type="text"
                placeholder="Search"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
              <FaSearch />
              <button className="btn btn-primary" onClick={fetchDroneData}>
                Fetch Data
              </button>
              <button className="btn btn-secondary" onClick={handleDownload}>
                Download
              </button>
              <button className="btn btn-secondary" onClick={clearFilters}>
                Clear
              </button>
            </div>
          </div>

          <div className="rawdata-input-fields">
            <input
              type="text"
              placeholder="Enter IMEI"
              value={imei}
              onChange={e => setImei(e.target.value)}
            />
            <input
              type="datetime-local"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            />
            <input
              type="datetime-local"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
            />
          </div>

          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <table className="rawdata-table">
            <thead>
              <tr>
                {getTableHeaders().map(header => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((drone, index) => (
                  <tr 
                    key={index} 
                    style={{ backgroundColor: drone.AD === 2 ? 'green !important' : 'transparent' }}
                  >
                    {Object.values(drone).map((value, i) => (
                      <td key={i}>{value || 'N/A'}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={getTableHeaders().length}>No data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RawData;
