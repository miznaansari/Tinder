import React from 'react';
import { Link, useNavigate } from 'react-router';
import { FaFacebookMessenger } from 'react-icons/fa';
import { FaTelegramPlane } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem('user');

  return (
    <nav className="bg-white shadow-md p-4">
      <ul className="flex justify-between items-center">
        <div className="flex space-x-4">
          <li className="font-bold text-black"><Link to="/home">Home</Link></li>
          {!user ? (
            <>
              <li className="font-bold text-black"><Link to="/login">Login</Link></li>
              <li className="font-bold text-black"><Link to="/signup">Signup</Link></li>
            </>
          ) : (
            <li>
              <button 
                onClick={() => {
                  localStorage.removeItem('user');
                  navigate('/login');
                }}
                className="font-bold text-black bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </li>
          )}
        </div>
        <li>
          <Link to="/friendlist" className="text-black text-2xl">
            <FaTelegramPlane />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;