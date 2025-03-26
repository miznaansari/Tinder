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
import UserSearch from './components/UserSearch';
import Userprofile from './components/Userprofile';
import Chatbot from './components/Chatbot';
import OnlineChecker from './components/OnlineChecker';
import FindLocation from './components/FindLocation';
import Trained from './components/Trained';
import Hero from './components/Hero';

function App() {
  const [userId, setUserId] = useState('');
  const [notification, setNotification] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('login'); // Manage navigation using state
const navigate = useNavigate();
  const socket = useRef(null);

  useEffect(() => {
    
    socket.current = io(`${import.meta.env.VITE_URL}`);
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
      setTimeout(()=>setNotification(''),5000)  ;
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  useEffect(()=>{
    const theme = localStorage.getItem('theme')
    document.documentElement.setAttribute('data-theme', theme)
  },[])

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
    {notification && <p className="absolutez-100 top-5 left-4 p-4 bg-blue-500 text-white rounded-lg shadow-lg">{notification}</p>}

    <OnlineChecker />

    
      <Routes>
      <Route path="/login" element={ <Login setUser={setUser} setUserId={setUserId} setIsLoggedIn={setIsLoggedIn} socket={socket} setCurrentPage={setCurrentPage} />} />
      <Route path="/signup" element={<Signup setCurrentPage={setCurrentPage} />} />
      <Route path="/hero" element={<>    <TinderPage userId={userId} user={user} socket={socket} onLogout={handleLogout} notification={notification} /> <FindLocation /></>} />
      <Route path="/friendlist" element={ <Acceptedfriendlist />} />
      <Route path="/chat" element={<Chat user={user} />} />
      <Route path="/" element={<Hero />} />
      <Route path="/Pendingrequest" element={<Pendingrequest />} />
      <Route path="/Online" element={<OnlineNotification />} />
      <Route path="/search" element={<UserSearch />} />
      <Route path="/profile" element={<Userprofile />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/loc" element={<FindLocation />} />
      <Route path="/train" element={<Trained />} />
    </Routes>
    </OnlineStatusProvider>

         
     
    </>
  );
}

export default App;
