import React from 'react';

const Notification = ({ message }) => {
  if (!message) return null;

  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#4CAF50',
      color: 'white',
      borderRadius: '5px',
      marginBottom: '10px'
    }}>
      {message}
    </div>
  );
};

export default Notification;
