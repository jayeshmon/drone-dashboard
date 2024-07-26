import React from 'react';
import logo from './logo.png'; // Make sure to replace this with your actual logo path

const Topbar = ({ expanded }) => {
 

  return (
    <div className={`topbar ${expanded ? 'expanded' : 'collapsed'}`}>
      <img src={logo} alt="Logo" className="logo" />
     
        <div className="drone">
         
        </div>
      </div>
      
   
  );
};

export default Topbar;