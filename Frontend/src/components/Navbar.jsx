import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { FaFacebookMessenger, FaTelegramPlane } from 'react-icons/fa';
import { FaMoon, FaSun } from 'react-icons/fa';
import { IoIosSearch } from "react-icons/io";
import { CiUser } from "react-icons/ci";

const Navbar = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem('user');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };
  return (
    <div className="card w-full bg-base-200 shadow-xl sticky top-0 z-100" style={{"borderRadius":"0px"}}>
      <div className="card-body flex flex-row justify-between items-center" style={{"borderRadius":"0px"}}>
        <div className="flex space-x-4 items-center">
        <Link to="/home" className="font-bold text-base-content">Home</Link>
          {!user ? (
            <>
              <Link to="/login" className="font-bold text-base-content">Login</Link>
              <Link to="/signup" className="font-bold text-base-content">Signup</Link>
            </>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem('user');
                navigate('/login');
              }}
              className="btn  text-base-content"
            >
              Logout
            </button>
          )}
        </div>
        <div className='flex gap-6 items-center'>
          {user &&  <IoIosSearch className='text-xl' onClick={()=>navigate('/search')}  /> }
        <Link to="/friendlist" className="text-base-content text-2xl">
          <FaTelegramPlane />
        </Link>
        <h1 onClick={()=>navigate('/profile')}><CiUser className='text-2xl' /></h1>
         <button onClick={toggleTheme} className="btn btn-ghost btn-sm">
                  {theme !== 'light' ? <FaMoon className='text-md' /> : <FaSun className='text-lg' />}
                </button>
                </div>
      </div>
    </div>
  );
};

export default Navbar;