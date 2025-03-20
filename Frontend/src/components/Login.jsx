import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';

const Login = ({ setUser, setUserId, setIsLoggedIn, socket }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscribe, setSubscribe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setErrorMessage('You must accept the terms of use.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://tinder-g832.onrender.com/api/login', { email, password });
      const loggedInUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(loggedInUser));

      if (socket?.current) {
        socket.current.emit('userConnected', loggedInUser._id);
      }

      setSuccessMessage('Login successful!');
      navigate('/home');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center  mt-25     "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="card w-100 bg-base-200 shadow-xl"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card-body gap-3">
          <h2 className="text-center text-xl font-bold">Sign In</h2>

          {/* Error and Success Messages with animation */}
          {errorMessage && (
            <motion.p
              className="text-red-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {errorMessage}
            </motion.p>
          )}
          {successMessage && (
            <motion.p
              className="text-green-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {successMessage}
            </motion.p>
          )}

          {/* Input Fields with Animation */}
          <motion.input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
          <motion.input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          />

          {/* Checkboxes with Animation */}
          <motion.label
            className="label cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <input
              type="checkbox"
              className="toggle toggle-sm"
              checked={subscribe}
              onChange={() => setSubscribe(!subscribe)}
            />
            <span className="ml-2">Submit to newsletter</span>
          </motion.label>

          <motion.label
            className="label cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <input
              type="checkbox"
              className="toggle toggle-sm"
              checked={acceptTerms}
              onChange={() => setAcceptTerms(!acceptTerms)}
            />
            <span className="ml-2">Accept terms of use</span>
          </motion.label>

          {/* Submit Button with Animation */}
          <motion.button
            className="btn btn-neutral w-full"
            onClick={handleLogin}
            disabled={loading}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </motion.button>

          <p className="text-center mt-4">
            Don't have an account?{' '}
            <button
              className="text-blue-500 hover:underline"
              onClick={() => navigate('/signup')}
            >
              Sign up here
            </button>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
