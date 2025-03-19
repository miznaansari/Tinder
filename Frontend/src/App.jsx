import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import './tinder.css';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router";

import Login from './components/Login';
import Signup from './components/Signup';
import TinderPage from './components/TinderPage';
import Navbar from './components/Navbar';
import Acceptedfriendlist from './components/Acceptedfriendlist';
import Chat from './components/chat';
import Pendingrequest from './components/Pendingrequest';

function App() {
  const [userId, setUserId] = useState('');
  const [notification, setNotification] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('login'); // Manage navigation using state
const navigate = useNavigate();
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('https://tinder-g832.onrender.com');
    console.log(socket)

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserId(parsedUser._id);
      setIsLoggedIn(true);
      setCurrentPage('home'); // Navigate to home
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
    navigate('/login'); // Go back to login after logout
    alert('Logged out successfully!');
  };

  // Navigation using state
       
  
  const [friendlist, setfriendlist] = useState(false);
  const [user, setUser] = useState(null);
  return (
    <>
    <Navbar setCurrentPage={setCurrentPage}  />


      <Routes>
      <Route path="/login" element={ <Login setUser={setUser} setUserId={setUserId} setIsLoggedIn={setIsLoggedIn} socket={socket} setCurrentPage={setCurrentPage} />} />
      <Route path="/signup" element={<Signup setCurrentPage={setCurrentPage} />} />
      <Route path="/home" element={ <TinderPage userId={userId} user={user} socket={socket} onLogout={handleLogout} notification={notification} />} />
      <Route path="/friendlist" element={ <Acceptedfriendlist />} />
      <Route path="/chat" element={<Chat user={user} />} />
      <Route path="/Pendingrequest" element={<Pendingrequest />} />
    </Routes>
      

         
     
    </>
  );
}

export default App;
