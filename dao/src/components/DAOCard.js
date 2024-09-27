// src/components/DAOCard.js
import React from 'react';
import '../styles/DAOCard.css'; // Import the CSS file

const DAOCard = ({ daoName, daoAddress }) => {
  return (
    <div className="dao-card">
      <h2>{daoName}</h2>
      <p><strong>DAO Address:</strong> {daoAddress}</p>
      {/* You can add more DAO details here if needed */}
    </div>
  );
};

export default DAOCard;
