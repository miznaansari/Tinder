import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './Tinder.css';

import Login from './components/Login';
import Signup from './components/Signup';
import TinderPage from './components/TinderPage';

function App() {
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('https://tinder-g832.onrender.com');

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserId(parsedUser._id);
      setIsLoggedIn(true);
      socket.current.emit('userConnected', parsedUser._id);
    }

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
    <Router>
      <div className="bg-gray-100 flex flex-col items-center min-h-screen">
        <h1 className="text-xl font-bold mt-8">Real-Time Friend Requests with Tinder</h1>
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} setUserId={setUserId} setIsLoggedIn={setIsLoggedIn} socket={socket} />} />
          <Route path="/signup" element={<Signup />} />
          {isLoggedIn ? (
            <Route path="/" element={<TinderPage userId={userId} user={user} socket={socket} onLogout={handleLogout} notification={notification} />} />
          ) : (
            <Route path="/" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
