import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io(`${import.meta.env.VITE_URL}`);

const OnlineChecker = () => {
  const [isSocketConnected, setIsSocketConnected] = useState(true);

  useEffect(() => {
    // Check connection status
    socket.on('connect', () => setIsSocketConnected(true));
    socket.on('disconnect', () => setIsSocketConnected(false));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  if (isSocketConnected) return null;

  return (
    <div role="alert" className="alert alert-error mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>You are offline. Please refresh the page or relogin.</span>
    </div>
  );
};

export default OnlineChecker;
