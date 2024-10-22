import React, { useState, useEffect } from 'react';
import './TilesComponent.css';
import DroneIcon from '@mui/icons-material/FlightTakeoff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import FlightIcon from '@mui/icons-material/Flight';
import MapIcon from '@mui/icons-material/Map';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Swal from 'sweetalert2';

// Define default values
const getDroneDataFromLocalStorage = () => JSON.parse(localStorage.getItem('droneData')) || [];

const TilesComponent = ({ onTileClick }) => {
  const [totalDrones, setTotalDrones] = useState(0);
  const [activeDrones, setActiveDrones] = useState(0);
  const [inactiveDrones, setInactiveDrones] = useState(0);
  const [flyingDrones, setFlyingDrones] = useState(0);
  const [totalAreaCovered, setTotalAreaCovered] = useState('0 sq km'); // State for total area covered
  const [totalFlyingHours, setTotalFlyingHours] = useState('0 Hours');
  const updateData = () => {
    const droneData = getDroneDataFromLocalStorage();
    const total = droneData.length;
    const active = droneData.filter(drone => drone.latestData?.p === 1).length;
    const inactive = total - active;
    const flying = droneData.filter(drone => parseFloat(drone.latestData?.s) > 0).length;

    setTotalDrones(total);
    setActiveDrones(active);
    setInactiveDrones(inactive);
    setFlyingDrones(flying);
  };

  const fetchTotalAreaCovered = async () => {
    try {
      const userjson = JSON.parse(localStorage.getItem('user'));
      console.log(userjson);
      const user = userjson?.username;
      const role = userjson?.role;
      // Conditional URL based on role
      const url = role === 'user'
        ? `${process.env.REACT_APP_API_URL}/trip/user/`+user 
        : `${process.env.REACT_APP_API_URL}/trip`;
  console.log(url);
      const response = await fetch(url);
      const data = await response.json();
      
      console.log(data);
  
      const totalKmCovered = parseFloat(data.totalKmCovered).toFixed(4) || 0;
      setTotalAreaCovered(`${totalKmCovered} Acres`);
      
    } catch (error) {
      console.error('Error fetching total area covered:', error);
    }
  };
  
  const fetchFlyingHours = async () => {
    try {
      const userjson = JSON.parse(localStorage.getItem('user'));
      console.log(userjson);
      const user = userjson?.username;
      const role = userjson?.role;
      // Conditional URL based on role
      const url = role === 'user'
        ? `${process.env.REACT_APP_API_URL}/flying-hours/user/`+user 
        : `${process.env.REACT_APP_API_URL}/flying-hours`;
  console.log(url);
      const response = await fetch(url);
      const data = await response.json();
      
      console.log(data);
  
      const totalFlyingHours = data.totalFlyingHours || 0;
      setTotalFlyingHours(`${totalFlyingHours} Hours`);
      
    } catch (error) {
      console.error('Error fetching total area covered:', error);
    }
  };



  useEffect(() => {
    // Initial data fetch
    updateData();
    fetchTotalAreaCovered(); // Fetch the total area covered from the API
    fetchFlyingHours();
    // Set interval to update data every 10 seconds
    const intervalId = setInterval(() => {
      updateData();
      fetchTotalAreaCovered();
      fetchFlyingHours();
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleClick = (type) => {
    if (type !== undefined) {
      localStorage.setItem('type', type);
      Swal.fire({
        title: 'Changed!',
        text: 'Data changed to ' + type + ' drones',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    }
  };

  const data = [
    { title: 'Total No of Drones', value: totalDrones, icon: <DroneIcon />, color: '#4caf50', type: 'all' },
    { title: 'No of Active Drones', value: activeDrones, icon: <CheckCircleIcon />, color: '#2196f3', type: 'active' },
    { title: 'No of Inactive Drones', value: inactiveDrones, icon: <HighlightOffIcon />, color: '#f44336', type: 'inactive' },
    { title: 'No of Drones Flying', value: flyingDrones, icon: <FlightIcon />, color: '#ff9800', type: 'flying' },
    { title: 'Total Area Covered', value: totalAreaCovered, icon: <MapIcon />, color: '#9c27b0' },
    { title: 'Total Hours', value: totalFlyingHours
    , icon: <AccessTimeIcon />, color: '#3f51b5' },
  ];

  return (
    <div className="tiles-component">
      {data.map((item, index) => (
        <div key={index} className="tile" style={{ borderColor: item.color }} onClick={() => handleClick(item.type)}>
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
