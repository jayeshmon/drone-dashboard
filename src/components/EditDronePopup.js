import React, { useState } from 'react';
import './EditDronePopup.css';
import UserDropdown from './UserDropdown'; // Import the UserDropdown component
import Swal from 'sweetalert2';
const EditDronePopup = ({ drone, onClose, onSave }) => {
  const [imei, setImei] = useState(drone.imei);
  const [droneName, setDroneName] = useState(drone.drone_name);
  const [model, setModel] = useState(drone.model);
  const [range, setRange] = useState(drone.range);
  const [assignedUser, setAssignedUser] = useState(drone.assignedUser || ''); // New state for the selected user

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that an assigned user is selected
    if (!assignedUser) {
      alert('Please select a user to assign the drone.');
      return;
    }

    const updatedDrone = { imei, drone_name: droneName, model, range, assignedUser };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/drones/${drone._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedDrone)
      });

      if (response.ok) {
        const data = await response.json();
        Swal.fire('Updated' ,`Drone updated: `, 'Updated');
        console.log('Drone updated:', data);
        onSave(data);
      } else {
        const error = await response.text();
        Swal.fire('Error' ,`Error Updating drone: ${error} `, 'Error');
        console.error('Error updating drone:', error);
        
      }
    } catch (err) {
      Swal.fire('Error' ,`Error Updating drone: ${err.message} `, 'Error');
      console.error('Error updating drone:', err.message);
      
    }

    onClose();
  };

  return (
    <div className="aumodal">
      <div className="aumodal-content">
        <h2>Edit Drone</h2>
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
            Range on 100% SOC:
            <input type="text" value={range} onChange={(e) => setRange(e.target.value)} required />
          </label>
          <label>
            Assign User:
            <UserDropdown selectedUser={assignedUser} onUserChange={setAssignedUser} />
          </label>
          <div className="aumodal-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="button" onClick={() => {
              setImei(drone.imei);
              setDroneName(drone.drone_name);
              setModel(drone.model);
              setRange(drone.range);
              setAssignedUser(drone.assignedUser || '');
            }}>Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDronePopup;
