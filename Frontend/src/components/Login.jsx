import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setUser, setUserId, setIsLoggedIn, socket }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    try {
      const response = await axios.post('https://tinder-g832.onrender.com/api/login', { email, password });
      const loggedInUser = response.data.user;

      setUser(loggedInUser);
      setUserId(loggedInUser._id);
      setIsLoggedIn(true);
      localStorage.setItem('user', JSON.stringify(loggedInUser));

      if (socket.current) {
        socket.current.emit('userConnected', loggedInUser._id);
      }

      alert('Login successful!');
    } catch (error) {
      alert('Error logging in: ' + error.response?.data?.message || error.message);
    }
  };

  return (
    <form className="bg-white shadow-md rounded-lg p-8 w-96" onSubmit={handleLogin}>
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <input
        className="w-full p-2 border rounded mb-4"
        type="email"
        placeholder="Enter your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full p-2 border rounded mb-4"
        type="password"
        placeholder="Enter your Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-blue-500 text-white w-full p-2 rounded" type="submit">
        Login
      </button>
    </form>
  );
};

export default Login;
