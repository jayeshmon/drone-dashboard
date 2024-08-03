import React, { useState, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import AddUserForm from './AddUserForm';
import AddDronePopup from './AddDronePopup';
import TilesComponent from './TilesComponent';
import MapComponent from './MapComponent';
import DroneCard from './DroneCard';
import Topbar from './Topbar';
import './AdminDashboard.css';
import AdminSidebar from './AdminSidebar';
import Swal from 'sweetalert2';

const libraries = ['places'];

const AdminDashboard = ({ onAddUser, onAddDevice }) => {
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showAddDeviceForm, setShowAddDeviceForm] = useState(false);
  const [droneLocations, setDroneLocations] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (showAddUserForm) setShowAddUserForm(false);
        if (showAddDeviceForm) setShowAddDeviceForm(false);
      }
      if (event.key === 'Enter') {
        if (showAddUserForm) document.getElementById('userFormSubmitButton').click();
        if (showAddDeviceForm) document.getElementById('deviceFormSubmitButton').click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showAddUserForm, showAddDeviceForm]);

  const handleAddUser = (user) => {
    console.log("Adding user", user);
    onAddUser(user);
    setShowAddUserForm(false);
  };
const handleTileClick = ()=>{
  
}
  const handleAddDevice = (device) => {
    console.log("Adding device", device);
    onAddDevice(device);
    setShowAddDeviceForm(false);
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDZXY8oBBXr0QqKgGH4TBzqM019b8lQXpk",
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const onTileClick = (type) => {
    alert(type);
    const droneData = JSON.parse(localStorage.getItem('droneData')) || [];
    let filteredDrones = [];
    
    if (type === 'all') {
      filteredDrones = droneData;
    } else if (type === 'active') {
      filteredDrones = droneData.filter(drone => drone.latestData?.p === 1);
    } else if (type === 'inactive') {
      filteredDrones = droneData.filter(drone => drone.latestData?.p !== 1);
    } else if (type === 'flying') {
      filteredDrones = droneData.filter(drone => parseFloat(drone.latestData?.s) > 0);
    }

    const locations = filteredDrones.map(drone => ({
      lat: drone.latestData?.lat,
      lng: drone.latestData?.lng
    }));

    if (locations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach(loc => bounds.extend(loc));
      setMapCenter(bounds.getCenter().toJSON());
    }

    setDroneLocations(locations);
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="main-content">
        <Topbar />
        <div className="content-wrapper">
          <div className="row">
            <div className="col-12">

<MapComponent zoom={6}/>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <TilesComponent/>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <DroneCard />
            </div>
          </div>
          <div className="row actions">
        <button  onClick={() => setShowAddUserForm(true)} className="btn btn-primary">
          Add User
        </button>
        <button onClick={() => setShowAddDeviceForm(true)} className="btn btn-primary">
          Add Drone
        </button>
      </div>
        </div>
      </div>

      {showAddUserForm && (
        <div className="modal-overlay">
          <AddUserForm
            onClose={() => setShowAddUserForm(false)}
            onSave={handleAddUser}
          />
        </div>
      )}

      {showAddDeviceForm && (
        <div className="modal-overlay">
          <AddDronePopup
            onClose={() => setShowAddDeviceForm(false)}
            onSave={handleAddDevice}
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
