import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import Login from './components/Login';
import FriendRequest from './components/FriendRequest';

function App() {
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Use a ref for socket to avoid reinitializing
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('http://localhost:4000');

    // Check for stored user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserId(parsedUser._id);
      setIsLoggedIn(true);
      socket.current.emit('userConnected', parsedUser._id);
    }

    // Listen for notifications
    socket.current.on('friendRequestNotification', (data) => {
      setNotification(data.message);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  const handleLogout = () => {
    setUser(null);
    setUserId('');
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    alert('Logged out successfully!');
  };

  return (
    
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
      <h1 className="text-4xl font-bold mb-10">Real-Time Friend Requests with MongoDB Atlas & Socket.IO</h1>

      {!isLoggedIn ? (
        <Login setUser={setUser} setUserId={setUserId} setIsLoggedIn={setIsLoggedIn} socket={socket} />
      ) : (
        <FriendRequest userId={userId} user={user} socket={socket} onLogout={handleLogout} notification={notification} />
      )}
    </div>
  );
}

export default App;
