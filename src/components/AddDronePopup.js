import React, { useState } from 'react';
import './AddDronePopup.css';

const AddDronePopup = ({ onClose, onSave }) => {
  const [imei, setImei] = useState('');
  const [drone_name, setDroneName] = useState('');
  const [model, setModel] = useState('');
  const [range, setRange] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newDrone = { imei, drone_name, model, range };

    try {
      // Retrieve the token from localStorage or other storage
      const token = localStorage.getItem('token'); // Adjust based on where you store the token
alert(token);
      const response = await fetch('http://localhost:3003/drones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the token in the headers
        },
        body: JSON.stringify(newDrone)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Drone added:', data);
        onSave(newDrone);
      } else {
        const error = await response.text();
        console.error('Error adding drone:', error);
        alert('Error adding drone: ' + error);
      }
    } catch (err) {
      console.error('Error adding drone:', err.message);
      alert('Error adding drone: ' + err.message);
    }

    onClose();
  };

  return (
    <div className="aumodal">
      <div className="aumodal-content">
        <h2>Add Drone</h2>
        <form onSubmit={handleSubmit}>
          <label>
            IMEI:
            <input type="text" value={imei} onChange={(e) => setImei(e.target.value)} required />
          </label>
          <label>
            Drone Name:
            <input type="text" value={drone_name} onChange={(e) => setDroneName(e.target.value)} required />
          </label>
          <label>
            Model / ID:
            <input type="text" value={model} onChange={(e) => setModel(e.target.value)} required />
          </label>
          <label>
            Range on 100% SOC:
            <input type="text" value={range} onChange={(e) => setRange(e.target.value)} required />
          </label>
          <div className="aumodal-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="button" onClick={() => {
              setImei('');
              setDroneName('');
              setModel('');
              setRange('');
            }}>Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDronePopup;
