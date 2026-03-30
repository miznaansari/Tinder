import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { auth, provider, signInWithPopup } from '../firebase-config';

const Login = ({ setUser, setUserId, setIsLoggedIn, socket }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const syncUserSession = (loggedInUser) => {
    localStorage.setItem('user', JSON.stringify(loggedInUser));

    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    if (typeof setUser === 'function') {
      setUser(loggedInUser);
    }

    if (typeof setUserId === 'function') {
      setUserId(loggedInUser._id);
    }

    if (typeof setIsLoggedIn === 'function') {
      setIsLoggedIn(true);
    }

    if (socket?.current) {
      socket.current.emit('userConnected', loggedInUser._id);
      socket.current.emit('user-online', loggedInUser._id);
    }
  };

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
      syncUserSession(loggedInUser);

      setSuccessMessage('Login successful. Redirecting...');
      setTimeout(() => {
        navigate('/home');
      }, 350);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setGoogleLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const response = await axios.post(`${import.meta.env.VITE_URL}/api/google-login`, {
        name: user.displayName,
        email: user.email,
        profilePicture: user.photoURL,
      });

      syncUserSession(response.data.user);
      setSuccessMessage('Google sign in successful. Redirecting...');

      setTimeout(() => {
      navigate('/home');
      }, 350);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <motion.section
      className="relative min-h-screen overflow-hidden bg-base-200 px-4 py-10 md:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="pointer-events-none absolute -left-10 top-10 h-56 w-56 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 bottom-12 h-56 w-56 rounded-full bg-amber-500/15 blur-3xl" />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          className="relative hidden rounded-3xl border border-base-300/70 bg-base-100 p-10 shadow-xl lg:flex lg:flex-col lg:justify-between"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="mb-4 inline-flex rounded-full border border-base-300 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-base-content/70">
              Welcome Back
            </p>
            <h1 className="text-4xl font-black leading-tight">
              Professional chat starts with a
              <span className="block bg-gradient-to-r from-cyan-500 via-primary to-amber-500 bg-clip-text text-transparent">
                clean sign in flow.
              </span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-base-content/75">
              Access your conversations, notifications, and profile in seconds with a secure and polished authentication experience.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-base-300/70 bg-base-200/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-base-content/55">Security</p>
              <p className="mt-1 text-sm font-semibold">Trusted OAuth and protected account login.</p>
            </div>
            <div className="rounded-xl border border-base-300/70 bg-base-200/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-base-content/55">Experience</p>
              <p className="mt-1 text-sm font-semibold">Fast access to your messages and community updates.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="card mx-auto w-full max-w-lg rounded-3xl border border-base-300/70 bg-base-100 shadow-2xl"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
        >
          <div className="card-body p-6 md:p-8">
            <div className="mb-2 text-center">
              <h2 className="text-3xl font-black tracking-tight">Sign In</h2>
              <p className="mt-2 text-sm text-base-content/70">Continue to ChatWithFriend with your account.</p>
            </div>

            <button
              type="button"
              className="btn btn-outline btn-primary mt-4 h-12 w-full rounded-xl"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
            >
              <img
                src="https://webimages.mongodb.com/_com_assets/cms/kr6fvgdym4qzsgqo3-Google%20Icon.svg?auto=format%252Ccompress"
                alt="Google"
                className="mr-2 h-5 w-5"
              />
              {googleLoading ? 'Signing in with Google...' : 'Continue with Google'}
              {googleLoading && <span className="loading loading-dots loading-xs" />}
            </button>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-base-300/70" />
              <span className="text-xs font-semibold uppercase tracking-widest text-base-content/50">or</span>
              <div className="h-px flex-1 bg-base-300/70" />
            </div>

            {errorMessage && (
              <motion.p
                className="mb-3 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-sm text-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {errorMessage}
              </motion.p>
            )}

            {successMessage && (
              <motion.p
                className="mb-3 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {successMessage}
              </motion.p>
            )}

            <form className="space-y-4" onSubmit={handleLogin}>
              <label className="form-control w-full">
                <span className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-base-content/60">Email Address</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered h-12 w-full rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </label>

              <label className="form-control w-full">
                <span className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-base-content/60">Password</span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="input input-bordered h-12 w-full rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </label>

              <div className="flex flex-col gap-3 pt-1">
                <label className="label cursor-pointer justify-start gap-3 rounded-lg border border-base-300/70 px-3 py-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={rememberMe}
                    onChange={() => setRememberMe((prev) => !prev)}
                  />
                  <span className="text-sm">Remember my email on this device</span>
                </label>

                <label className="label cursor-pointer justify-start gap-3 rounded-lg border border-base-300/70 px-3 py-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={acceptTerms}
                    onChange={() => setAcceptTerms((prev) => !prev)}
                  />
                  <span className="text-sm">I accept the terms of use and privacy policy</span>
                </label>
              </div>

              <motion.button
                type="submit"
                className="btn btn-primary h-12 w-full rounded-xl border-none text-primary-content shadow-lg shadow-primary/20"
                disabled={loading || googleLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {loading ? 'Signing In...' : 'Sign In Securely'}
              </motion.button>
            </form>

            <p className="mt-5 text-center text-sm text-base-content/70">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                className="font-semibold text-primary transition-colors hover:text-primary/80"
                onClick={() => navigate('/signup')}
              >
                Create one now
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Login;

