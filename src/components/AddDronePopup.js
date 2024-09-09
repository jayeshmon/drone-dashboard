import React, { useState, useEffect } from 'react';
import './AddDronePopup.css';
import UserDropdown from './UserDropdown'; // Import the UserDropdown component
import Swal from 'sweetalert2';

const AddDronePopup = ({ onClose, onSave }) => {
  const [imei, setImei] = useState('');
  const [droneName, setDroneName] = useState('');
  const [model, setModel] = useState('');
  const [range, setRange] = useState('');
  const [assignedUser, setAssignedUser] = useState(''); // This will store the ObjectId of the selected user

  // Fetch the list of users if necessary
  useEffect(() => {
    // Fetch user data if the UserDropdown component requires it
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that an assigned user is selected if required
    if (!assignedUser) {
      Swal.fire('Error', 'Please select a user to assign the drone.', 'error');
      return;
    }

    const newDrone = { imei, drone_name: droneName, model, range, assignedUser };

    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage

      const response = await fetch(`${process.env.REACT_APP_API_URL}/drones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the token in the headers
        },
        body: JSON.stringify(newDrone)
      });

      if (response.ok) {
        const data = await response.json();
        Swal.fire('Success', 'Drone added successfully!', 'success');
        onSave(data);
        onClose();
      } else {
        const error = await response.text();
        Swal.fire('Error', `Error adding drone: ${error}`, 'error');
        console.error('Error adding drone:', error);
      }
    } catch (err) {
      Swal.fire('Error', `Error adding drone: ${err.message}`, 'error');
      console.error('Error adding drone:', err.message);
    }
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
            <input type="text" value={droneName} onChange={(e) => setDroneName(e.target.value)} required />
          </label>
          <label>
            Model / ID:
            <input type="text" value={model} onChange={(e) => setModel(e.target.value)} required />
          </label>
          <label>
            Range on 100% SOC (km):
            <input type="number" value={range} onChange={(e) => setRange(e.target.value)} required />
          </label>
          <label>
            Assign User:
            <UserDropdown selectedUser={assignedUser} onUserChange={setAssignedUser} />
          </label>
          <div className="aumodal-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Cancel</button>
            <button
              type="button"
              onClick={() => {
                setImei('');
                setDroneName('');
                setModel('');
                setRange('');
                setAssignedUser('');
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDronePopup;
