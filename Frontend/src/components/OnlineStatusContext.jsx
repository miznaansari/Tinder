import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const OnlineStatusContext = createContext();
const socket = io(`${import.meta.env.VITE_URL}`);

export const OnlineStatusProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState(new Map());

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?._id) {
      socket.emit('user-online', user._id);
    }

    socket.on('update-online-users', (users) => {
      const userMap = new Map(users.map((id) => [id, true]));
      setOnlineUsers(userMap);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <OnlineStatusContext.Provider value={onlineUsers}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

export const useOnlineStatus = () => {
  return useContext(OnlineStatusContext);
};
