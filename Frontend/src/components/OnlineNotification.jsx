import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://tinder-g832.onrender.com'); // Adjust the URL if needed

const OnlineNotification = () => {
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    socket.on('userStatusChange', ({ userId, isOnline }) => {
      if (isOnline) {
        // Show notification for online user
        setToastMessage(`User name ${userId} is now online!`);
        setTimeout(() => setToastMessage(''), 5000); // Clear toast after 3 seconds
      }
    });

    return () => {
      socket.off('userStatusChange');
    };
  }, []);

  return (
    <>
      {toastMessage && (
        <div className="toast z-100">
          <div className="alert alert-info">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default OnlineNotification;
