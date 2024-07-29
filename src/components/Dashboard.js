import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MapComponent from './MapComponent';
import DroneCard from './DroneCard';
import TilesComponent from './TilesComponent';
import './Dashboard.css';
import './Sidebar.css';
import './Topbar.css';
import Swal from 'sweetalert2';
const Dashboard = () => {
  return (
    <div className="dashboard container-fluid">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="content-wrapper">
          <div className="row">
            <div className="col-12">
              <MapComponent />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <TilesComponent />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <DroneCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
