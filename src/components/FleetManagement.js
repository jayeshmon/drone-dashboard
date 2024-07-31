import React, { useState } from 'react';
import './FleetManagement.css';

import Drones from './Drones';
import Swal from 'sweetalert2';

const FleetManagement = () => {
  const [currentTab, setCurrentTab] = useState('Drones');

  return (
   <Drones/>
  );
};

export default FleetManagement;
