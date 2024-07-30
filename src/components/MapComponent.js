import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Swal from 'sweetalert2';
import './MapComponent.css';

const containerStyle = {
  width: '100%',
  height: '300px'
};

const defaultCenter = {
  lat: 37.7749, // Default latitude
  lng: -122.4194 // Default longitude
};

const MapComponent = () => {
  const [locations, setLocations] = useState([]);
  const [center, setCenter] = useState(defaultCenter);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const username = user?.username;
    const role = user?.role;

    const fetchDronesData = async () => {
      try {
        let response;
        if (role === 'admin') {
          response = await fetch('http://localhost:3003/alldronesdata'); // Replace with your API endpoint for all drones
        } else {
          response = await fetch(`http://localhost:3003/dronesdata/${username}`); // Replace with your API endpoint for user-specific drones
        }
        const data = await response.json();

        // Save the entire JSON data in local storage
        localStorage.setItem('droneData', JSON.stringify(data));

        // Extract the locations data for the map
        const droneLocations = data.map(drone => ({
          lat: drone.latestData.lat,
          lng: drone.latestData.lng,
          title: drone.drone_name
        }));

        // Save drone locations in local storage
        localStorage.setItem('droneLocations', JSON.stringify(droneLocations));

        // Set locations and map center
        setLocations(droneLocations);
        if (droneLocations.length > 0) {
          setCenter({ lat: 0, lng: 10 });
        }
      } catch (error) {
        console.error('Error fetching drone data:', error);
        Swal.fire('Error', 'Failed to load drone data', 'error');
      }
    };

    // Fetch data initially
    fetchDronesData();

    // Set interval to fetch data every 10 seconds
    const intervalId = setInterval(fetchDronesData, 10000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <LoadScript googleMapsApiKey="AIzaSyDZXY8oBBXr0QqKgGH4TBzqM019b8lQXpk">
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
    </LoadScript>
  );
};

export default MapComponent;
