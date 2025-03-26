import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { FaTelegramPlane, FaMoon, FaSun } from 'react-icons/fa';
import { IoIosSearch } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { FiMenu } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem('user');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleNavigate = (path) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  return (
    <div className="card w-full bg-base-200 shadow-xl sticky top-0 z-100" style={{ borderRadius: '0px' }}>
      <div className="card-body flex flex-row justify-between items-center" style={{ borderRadius: '0px' }}>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <FiMenu className="text-xl" onClick={() => setIsDropdownOpen(!isDropdownOpen)} />
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-40 bg-base-100 shadow-lg rounded-lg p-3 z-50">
              <Link to="/" className="block py-2" onClick={() => setIsDropdownOpen(false)}>Home</Link>
              {!user ? (
                <>
                  <Link to="/login" className="block py-2" onClick={() => setIsDropdownOpen(false)}>Login</Link>
                  <Link to="/signup" className="block py-2" onClick={() => setIsDropdownOpen(false)}>Signup</Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    localStorage.removeItem('user');
                    setIsDropdownOpen(false);
                    navigate('/login');
                  }}
                  className="block py-2 w-full text-left"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 items-center">
          <Link to="/" className="font-bold">Home</Link>
          {!user ? (
            <>
              <Link to="/login" className="font-bold">Login</Link>
              <Link to="/signup" className="font-bold">Signup</Link>
            </>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem('user');
                navigate('/login');
              }}
              className="btn"
            >
              Logout
            </button>
          )}
        </div>

        <Link to="/">   
          <h1 className="text-lg md:text-2xl font-bold">ChatWithFriend</h1>
        </Link>

        {/* Icons Section */}
        <div className='flex gap-6 items-center'>
          {user && (
            <>
              <IoIosSearch className='text-xl' onClick={() => handleNavigate('/search')} />
              <h1 onClick={() => handleNavigate('/profile')}>
                <CiUser className='text-2xl' />
              </h1>
            </>
          )}
          <Link to="/friendlist" className="text-2xl">
            <FaTelegramPlane />
          </Link>
          <button onClick={toggleTheme} className="btn btn-ghost btn-sm">
            {theme !== 'light' ? <FaMoon className='text-md' /> : <FaSun className='text-lg' />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
