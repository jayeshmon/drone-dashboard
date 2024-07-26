import React from 'react';
import './TopNav.css';

const TopNav = ({ setCurrentTab, currentTab }) => {
  return (
    <div className="top-nav">
      <div
        className={`nav-item ${currentTab === 'Drones' ? 'active' : ''}`}
        onClick={() => setCurrentTab('Drones')}
      >
        Drones <i className="fas fa-question-circle"></i>
      </div>
      
      
  
    </div>
  );
};

export default TopNav;
