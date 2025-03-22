import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { auth, provider, signInWithPopup } from '../firebase-config';

const Login = ({ setUser, setUserId, setIsLoggedIn, socket }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscribe, setSubscribe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoader, setgoogleLoader] = useState(false)
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
      const response = await axios.post(`${import.meta.env.VITE_URL}/api/login`, { email, password });
      const loggedInUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(loggedInUser));

      if (socket?.current) {
        socket.current.emit('userConnected', loggedInUser._id);
        socket.current.emit('user-online', loggedInUser._id);
      }

      setSuccessMessage('Login successful!');
      navigate('/home');
    } catch (error) {
      setErrorMessage(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setgoogleLoader(true)
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Send user data to backend
      const response = await axios.post(`${import.meta.env.VITE_URL}/api/google-login`, { name: user.displayName,
        email: user.email,
        profilePicture: user.photoURL });
      console.log(response.data.user);
      // const userdata = JSON.parse(response.data.user)
      localStorage.setItem('user', JSON.stringify(response.data.user));

      if (socket?.current) {
        socket.current.emit('userConnected', response.data.user._id);
        socket.current.emit('user-online', response.data.user._id);
      }
    setgoogleLoader(false)

      navigate('/home');
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    } finally {
      // Ensure loader is stopped in both success and error cases
      setgoogleLoader(false);
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center  mt-15     "
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
 {/* Google Sign-In Button */}
 <button className="btn btn-outline btn-primary w-full mb-4" onClick={handleGoogleSignIn}>
            <img src="https://webimages.mongodb.com/_com_assets/cms/kr6fvgdym4qzsgqo3-Google%20Icon.svg?auto=format%252Ccompress" alt="Google" className="w-5 h-5 mr-2" />
          {googleLoader?"Signing":"Sign in with Google"}   {googleLoader&&<span className="loading loading-dots loading-xs"></span>}
          </button>

           {/* Separator with OR and Line */}
           <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
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

// import React from 'react';
// import { auth, provider, signInWithPopup } from '../firebase-config';

// const Login = () => {

//   const handleGoogleSignIn = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;

//       // Send user data to backend
//       const response = await fetch('http://localhost:5000/api/google-login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: user.displayName,
//           email: user.email,
//           profilePicture: user.photoURL
//         }),
//       });

//       const data = await response.json();
//       console.log('Server Response:', data);
//     } catch (error) {
//       console.error('Error during Google sign-in:', error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleGoogleSignIn}>Sign in with Google</button>
//     </div>
//   );
// };

// export default Login;

