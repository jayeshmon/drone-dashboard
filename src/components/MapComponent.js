import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './MapComponent.css';
import Swal from 'sweetalert2';
const containerStyle = {
  width: '100%',
  height: '300px'
};

const center = {
  lat: 37.7749, // Latitude for the center of the map
  lng: -122.4194 // Longitude for the center of the map
};

const locations = [
  { lat: 37.7749, lng: -122.4194, title: "San Francisco" },
  { lat: 34.0522, lng: -118.2437, title: "Los Angeles" },
  { lat: 36.1699, lng: -115.1398, title: "Las Vegas" },
  { lat: 40.7128, lng: -74.0060, title: "New York" }
];

const MapComponent = () => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyDZXY8oBBXr0QqKgGH4TBzqM019b8lQXpk">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
      >
        {locations.map((location, index) => (
          <Marker key={index} position={{ lat: location.lat, lng: location.lng }} title={location.title} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
