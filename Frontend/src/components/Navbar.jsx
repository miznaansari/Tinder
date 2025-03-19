import React from 'react';
import { Link, useNavigate } from 'react-router';
import { FaFacebookMessenger, FaTelegramPlane } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem('user');

  return (
    <div className="card w-full bg-base-200 shadow-xl sticky top-0 z-100" style={{"borderRadius":"0px"}}>
      <div className="card-body flex flex-row justify-between items-center" style={{"borderRadius":"0px"}}>
        <div className="flex space-x-4 items-center">
          <Link to="/home" className="font-bold text-gray-200">Home</Link>
          {!user ? (
            <>
              <Link to="/login" className="font-bold text-gray-200">Login</Link>
              <Link to="/signup" className="font-bold text-gray-200">Signup</Link>
            </>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem('user');
                navigate('/login');
              }}
              className="btn  text-white"
            >
              Logout
            </button>
          )}
        </div>
        <Link to="/friendlist" className="text-gray-200 text-2xl">
          <FaTelegramPlane />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;