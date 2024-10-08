import React, { useState } from 'react';
import './FleetManagement.css';
import TopNav from './TopNav';
import Drones from './Drones';
import Swal from 'sweetalert2';

const FleetManagement = () => {
  const [currentTab, setCurrentTab] = useState('Drones');

  return (
    <div className="fleet-management">
      
      {currentTab === 'Drones' ? <Drones /> : <Drones />}
    </div>
  );
};

export default FleetManagement;
