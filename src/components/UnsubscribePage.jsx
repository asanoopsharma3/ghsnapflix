import React from 'react';
import './UnsubscribePage.css';

const UnsubscribePage = ({ onNavigate = () => {} }) => {
  return (
    <div className="unsubscribe-page">
      <div className="unsubscribe-card">
        <h1>Unsubscribe</h1>
        <button type="button" onClick={() => onNavigate('home')}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default UnsubscribePage;
