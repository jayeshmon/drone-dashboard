import React from 'react';
import MapComponent from './MapComponent';
import DroneCard from './DroneCard';
import TilesComponent from './TilesComponent';
import './Dashboard.css';


const Dashboard = () => {
  return (
    <div className="dashboard container-fluid">
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
  );
};

export default Dashboard;
