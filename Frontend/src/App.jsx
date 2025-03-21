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
import { OnlineStatusProvider } from './components/OnlineStatusContext';
import OnlineNotification from './components/OnlineNotification';

function App() {
  const [userId, setUserId] = useState('');
  const [notification, setNotification] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('login'); // Manage navigation using state
const navigate = useNavigate();
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('http://localhost:4000/');
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
  const [onlinestatus, setonlinestatus] = useState(false)
 
  return (
    <>
    
     <OnlineStatusProvider >
    <Navbar setCurrentPage={setCurrentPage}  />
    <OnlineNotification />

    {onlinestatus && <div role="alert" className="alert alert-error">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>Your are Offline.</span>
</div>
}
    
      <Routes>
      <Route path="/login" element={ <Login setUser={setUser} setUserId={setUserId} setIsLoggedIn={setIsLoggedIn} socket={socket} setCurrentPage={setCurrentPage} />} />
      <Route path="/signup" element={<Signup setCurrentPage={setCurrentPage} />} />
      <Route path="/home" element={ <TinderPage userId={userId} user={user} socket={socket} onLogout={handleLogout} notification={notification} />} />
      <Route path="/friendlist" element={ <Acceptedfriendlist />} />
      <Route path="/chat" element={<Chat user={user} />} />
      <Route path="/Pendingrequest" element={<Pendingrequest />} />
      <Route path="/Online" element={<OnlineNotification />} />
    </Routes>
    </OnlineStatusProvider>

         
     
    </>
  );
}

export default App;
