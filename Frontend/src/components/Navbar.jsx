import React from 'react';
import { FaFacebookMessenger } from 'react-icons/fa';
import { FaTelegramPlane } from 'react-icons/fa';

const Navbar = ({setCurrentPage}) => {
  const user = localStorage.getItem('user');

  return (
    <nav className="bg-white shadow-md p-4">
      <ul className="flex justify-between items-center">
        <div className="flex space-x-4">
          <li className="font-bold text-black"><button onClick={()=>setCurrentPage('/')} >Home</button></li>
          {!user ? (
            <>
              <li className="font-bold text-black"><a href="/login">Login</a></li>
              <li className="font-bold text-black"><a href="/signup">Signup</a></li>
            </>
          ) : (
            <li>
              <button 
                onClick={() => {
                  localStorage.removeItem('user');
                  window.location.reload();
                }}
                className="font-bold text-black bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </li>
          )}
        </div>
        <li>
          <button onClick={()=>setCurrentPage('friendlist')} className="text-black text-2xl">
            <FaTelegramPlane />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;