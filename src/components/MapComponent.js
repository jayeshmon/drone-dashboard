import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import Swal from 'sweetalert2';
import './MapComponent.css';

const containerStyle = {
  width: '100%',
  height: '300px',
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

const MapComponent = () => {
  const [locations, setLocations] = useState([]);
  const [center, setCenter] = useState(defaultCenter);

  useEffect(() => {
    const fetchDronesData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const username = user?.username;
        const role = user?.role;

        let response;
        if (role === 'admin') {
          response = await fetch('http://localhost:3003/alldronesdata');
        } else {
          response = await fetch(`http://localhost:3003/dronesdata/${username}`);
        }
        const data = await response.json();

        localStorage.setItem('droneData', JSON.stringify(data));

        const droneLocations = data
          .filter(drone => {
            const lat = parseFloat(drone.latestData?.l);
            const lng = parseFloat(drone.latestData?.g);
            return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
          })
          .map(drone => ({
            lat: parseFloat(drone.latestData.l),
            lng: parseFloat(drone.latestData.g),
            title: drone.drone_name || 'Unknown Drone',
          }));

        localStorage.setItem('droneLocations', JSON.stringify(droneLocations));
        setLocations(droneLocations);

        if (droneLocations.length > 0) {
          setCenter({
            lat: droneLocations[0].lat,
            lng: droneLocations[0].lng,
          });
        }
      } catch (error) {
        console.error('Error fetching drone data:', error);
        Swal.fire('error', 'Failed to load drone data', 'error');
      }
    };

    fetchDronesData();
    const intervalId = setInterval(fetchDronesData, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: location.lat, lng: location.lng }}
            title={location.title}
          />
        ))}
      </GoogleMap>
    
  );
};

export default MapComponent;
