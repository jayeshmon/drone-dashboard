import React from 'react';
import './TilesComponent.css';
import DroneIcon from '@mui/icons-material/FlightTakeoff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import FlightIcon from '@mui/icons-material/Flight';
import MapIcon from '@mui/icons-material/Map';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Swal from 'sweetalert2';
const data = [
  { title: 'Total No of Drones', value: 100, icon: <DroneIcon />, color: '#4caf50' },
  { title: 'No of Active Drones', value: 80, icon: <CheckCircleIcon />, color: '#2196f3' },
  { title: 'No of Inactive Drones', value: 20, icon: <HighlightOffIcon />, color: '#f44336' },
  { title: 'No of Drones Flying', value: 15, icon: <FlightIcon />, color: '#ff9800' },
  { title: 'Total Area Covered', value: '500 sq km', icon: <MapIcon />, color: '#9c27b0' },
  { title: 'Total Hours', value: '2000 hrs', icon: <AccessTimeIcon />, color: '#3f51b5' },
];

const TilesComponent = () => {
  return (
    <div className="tiles-component">
      {data.map((item, index) => (
        <div key={index} className="tile" style={{ borderColor: item.color }}>
          <div className="tile-content">
            <div className="tile-icon" style={{ color: item.color }}>
              {item.icon}
            </div>
            <div className="tile-info">
              <h3>{item.value}</h3>
              <p>{item.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TilesComponent;
