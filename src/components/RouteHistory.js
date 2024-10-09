import React, { useState, useEffect } from 'react';
import { GoogleMap, Polyline, Marker } from '@react-google-maps/api';
import Swal from 'sweetalert2';
import './RouteHistory.css'; // Ensure this CSS file is present

const mapContainerStyle = {
  height: '500px',
  width: '100%',
};

const RouteHistory = ({ imei: propsImei }) => {
  const [imei, setImei] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [mapData, setMapData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

  // Use useEffect to set imei when props change
  useEffect(() => {
    if (propsImei) {
      setImei(propsImei);
    }
  }, [propsImei]);

  const fetchData = () => {
    if (imei && startDate && endDate) {
      let sDate=startDate.replace("T"," ");
      let eDate=endDate.replace("T"," ");

      console.log(startDate);
      console.log(endDate);
      fetch(`${process.env.REACT_APP_API_URL}/dronedatabydate/${imei}/${sDate}/${eDate}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch route history');
          }
          return response.json();
        })
        .then((data) => {
          // Validate and log the fetched data
          console.log('Fetched data:', data);
          setMapCenter({ lat: parseFloat(data[0].l), lng: parseFloat(data[0].g) });
          setMapData(data);
        })
        .catch((error) => {
          Swal.fire({
            title: 'Error!',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        });
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Please provide IMEI, Start Date, and End Date.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="route-history-container">
      <h3>Route History</h3>
      <div className="route-history-form">
        <div className="form-group">
          <label htmlFor="imei">IMEI</label>
          <input
            type="text"
            readOnly
            id="imei"
            value={imei}
          />
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Start Date & Time</label>
          <input
            type="datetime-local"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date & Time</label>
          <input
            type="datetime-local"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={fetchData}>
          Load Route History
        </button>
      </div>

      <div className="map-container mt-4">
      <GoogleMap
  mapContainerStyle={mapContainerStyle}
  // Set the center after discarding invalid coordinates
  center={
    mapData
      .map((location) => {
        const lat = parseFloat(location.l.trim());
        const lng = parseFloat(location.g.trim());

        // Discard packets where latitude or longitude is 0 or near zero
        if (lat === 0 || lng === 0) {
          return null;
        }

        return { lat, lng };
      })
      .filter((location) => location !== null)
      .reduce(
        (acc, location, _, array) => {
          acc.lat += location.lat / array.length;
          acc.lng += location.lng / array.length;
          return acc;
        },
        { lat: 0, lng: 0 }
      )
  }
  zoom={12}
>
  {mapData.length > 0 && (
    <>
      <Polyline
        path={mapData
          .map((location) => {
            const lat = parseFloat(location.l.trim());
            const lng = parseFloat(location.g.trim());

            // Discard packets where latitude or longitude is 0 or near zero
            if (lat === 0 || lng === 0) {
              return null;
            }

            return { lat, lng };
          })
          // Filter out any null values from the map
          .filter((location) => location !== null)}
        options={{
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
        }}
      />

      {/* Get valid locations */}
      {(() => {
        const validLocations = mapData
          .map((location) => {
            const lat = parseFloat(location.l.trim());
            const lng = parseFloat(location.g.trim());

            // Discard packets where latitude or longitude is 0 or near zero
            if (lat === 0 || lng === 0) {
              return null;
            }

            return { lat, lng };
          })
          .filter((location) => location !== null);

        if (validLocations.length > 0) {
          // Starting point (green marker)
          const start = validLocations[0];

          // Ending point (red marker)
          const end = validLocations[validLocations.length - 1];

          return (
            <>
              <Marker
                position={start}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                }}
              />
              <Marker
                position={end}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                }}
              />
            </>
          );
        }
        return null;
      })()}
    </>
  )}
</GoogleMap>

      </div>
    </div>
  );
};

export default RouteHistory;
