import React, { useState } from 'react';
import './Drones.css';
import Papa from 'papaparse';
import AddDronePopup from './AddDronePopup';

const Drones = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [dronesData, setDronesData] = useState([
    { id: 1, imei: '860305052252030', name: 'DJI Matrice 600', model: 'C294753', batteryId: 'BTRY021', soc: 62, status: 'green' },
    { id: 2, imei: '860305052252031', name: 'DJI Mavic Enterprise', model: 'C293841', batteryId: 'BTRY022', soc: 44, status: 'green' },
    { id: 3, imei: '860305052252032', name: 'x1', model: 'C393748', batteryId: 'BTRY023', soc: 71, status: 'red' },
    { id: 4, imei: '860305052252033', name: 'x1', model: 'C395832', batteryId: 'BTRY024', soc: 71, status: 'green' },
    { id: 5, imei: '860305052252034', name: 'Scan Eagle', model: 'C293843', batteryId: 'BTRY025', soc: 92, status: 'red' },
    { id: 6, imei: '860305052252035', name: 'xFrame 20', model: 'C393848', batteryId: 'BTRY026', soc: 92, status: 'green' },
    { id: 7, imei: '860305052252036', name: 'xFrame 50', model: 'C293586', batteryId: 'BTRY027', soc: 70, status: 'green' },
    { id: 8, imei: '860305052252037', name: 'xFrame 50', model: 'C929572', batteryId: 'BTRY028', soc: 92, status: 'green' },
    { id: 9, imei: '860305052252038', name: 'xFrame 10H', model: 'C672731', batteryId: 'BTRY029', soc: 92, status: 'red' },
    { id: 10, imei: '860305052252039', name: 'DJI Phantom 4', model: 'C394857', batteryId: 'BTRY030', soc: 55, status: 'green' },
    { id: 11, imei: '860305052252040', name: 'DJI Phantom 3', model: 'C394858', batteryId: 'BTRY031', soc: 60, status: 'green' },
    { id: 12, imei: '860305052252041', name: 'DJI Inspire 1', model: 'C394859', batteryId: 'BTRY032', soc: 75, status: 'red' },
    { id: 13, imei: '860305052252042', name: 'DJI Inspire 2', model: 'C394860', batteryId: 'BTRY033', soc: 85, status: 'green' },
    { id: 14, imei: '860305052252043', name: 'DJI Matrice 200', model: 'C394861', batteryId: 'BTRY034', soc: 90, status: 'green' },
    { id: 15, imei: '860305052252044', name: 'DJI Matrice 300', model: 'C394862', batteryId: 'BTRY035', soc: 95, status: 'green' }
  ]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filter, setFilter] = useState('');

  const sortedDrones = React.useMemo(() => {
    let sortableDrones = [...dronesData];
    if (sortConfig !== null) {
      sortableDrones.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableDrones;
  }, [dronesData, sortConfig]);

  const filteredDrones = sortedDrones.filter(drone =>
    drone.imei.includes(filter) ||
    drone.name.toLowerCase().includes(filter.toLowerCase()) ||
    drone.model.toLowerCase().includes(filter.toLowerCase()) ||
    drone.batteryId.toLowerCase().includes(filter.toLowerCase()) ||
    drone.soc.toString().includes(filter) ||
    drone.status.toLowerCase().includes(filter.toLowerCase())
  );

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleFileUpload = event => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: results => {
          const newDrones = results.data.map((row, index) => ({
            id: dronesData.length + index + 1,
            imei: row['IMEI'],
            name: row['Drone Name'],
            model: row['Model / ID'],
            batteryId: row['Battery ID'],
            soc: row['SOC % (Charge)'],
            status: row['Status'].toLowerCase(),
          }));
          setDronesData([...dronesData, ...newDrones]);
        },
      });
    }
  };

  return (
    <div className="drones">
      <div className="drones-header">
        <h2>Manage Drones</h2>
        <div className="search-bar">
          <i className="fas fa-download"></i>
          <input type="text" placeholder="Search" value={filter} onChange={e => setFilter(e.target.value)} />
          <i className="fas fa-plus" onClick={togglePopup}></i>
        </div>
      </div>
      <table className="drones-table">
        <thead>
          <tr>
            <th onClick={() => requestSort('id')}>Sl No</th>
            <th onClick={() => requestSort('imei')}>IMEI</th>
            <th onClick={() => requestSort('name')}>Drone Name</th>
            <th onClick={() => requestSort('model')}>Model / ID</th>
            <th onClick={() => requestSort('batteryId')}>Battery ID</th>
            <th onClick={() => requestSort('soc')}>SOC % (Charge)</th>
            <th onClick={() => requestSort('status')}>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDrones.map((drone, index) => (
            <tr key={drone.id}>
              <td>{index + 1}</td>
              <td>{drone.imei}</td>
              <td>{drone.name}</td>
              <td>{drone.model}</td>
              <td>{drone.batteryId}</td>
              <td>{drone.soc}%</td>
              <td><span className={`status ${drone.status}`}></span></td>
              <td>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <i className="fas fa-chevron-left"></i>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>...</span>
        <i className="fas fa-chevron-right"></i>
      </div>

      <AddDronePopup showPopup={showPopup} togglePopup={togglePopup} handleFileUpload={handleFileUpload} />
    </div>
  );
};

export default Drones;
