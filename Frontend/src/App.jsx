import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import './tinder.css';

import Login from './components/Login';
import Signup from './components/Signup';
import TinderPage from './components/TinderPage';

function App() {
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('login'); // Manage navigation using state

  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('https://tinder-g832.onrender.com');

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
    setCurrentPage('login'); // Go back to login after logout
    alert('Logged out successfully!');
  };

  // Navigation using state
  const renderPage = () => {
    if (!isLoggedIn) {
      if (currentPage === 'login') {
        return <Login setUser={setUser} setUserId={setUserId} setIsLoggedIn={setIsLoggedIn} socket={socket} setCurrentPage={setCurrentPage} />;
      }
      if (currentPage === 'signup') {
        return <Signup setCurrentPage={setCurrentPage} />;
      }
    } else {
      return <TinderPage userId={userId} user={user} socket={socket} onLogout={handleLogout} notification={notification} />;
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col items-center min-h-screen">
      <h1 className="text-xl font-bold mt-8">Real-Time Friend Requests with Tinder</h1>
      {renderPage()}
      {!isLoggedIn && (
        <div>
          {currentPage === 'login' ? (
            <p>
              Don't have an account? <button onClick={() => setCurrentPage('signup')} className="text-blue-500">Sign Up</button>
            </p>
          ) : (
            <p>
              Already have an account? <button onClick={() => setCurrentPage('login')} className="text-blue-500">Login</button>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
