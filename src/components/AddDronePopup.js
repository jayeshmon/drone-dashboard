import React from 'react';
import './AddDronePopup.css';

const AddDronePopup = ({ showPopup, togglePopup, handleFileUpload }) => {
  return (
    <>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h2>Add New Drone</h2>
              <button onClick={togglePopup} className="btn-close">&times;</button>
            </div>
            <div className="popup-body">
              <input type="text" placeholder="IMEI" />
              <input type="text" placeholder="Drone Name" />
              <input type="text" placeholder="Model / ID" />
              <select>
                <option value="BTRY021">BTRY021</option>
                <option value="BTRY022">BTRY022</option>
                <option value="BTRY023">BTRY023</option>
                <option value="BTRY024">BTRY024</option>
              </select>
              <select>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <input type="text" placeholder="Range on 100% SOC" />
              <div className="file-upload">
                <input type="file" accept=".csv" onChange={handleFileUpload} />
                <p>Upload CSV file for bulk upload</p>
              </div>
            </div>
            <div className="popup-footer">
              <button className="btn-add">Add</button>
              <button className="btn-reset">Reset</button>
              <button className="btn-cancel" onClick={togglePopup}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddDronePopup;
