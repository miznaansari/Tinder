import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { FaTelegramPlane, FaMoon, FaSun } from 'react-icons/fa';
import { IoIosSearch } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { FiMenu } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = localStorage.getItem('user');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDropdownOpen]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleNavigate = (path) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const navBaseClass =
    'rounded-full px-4 py-2 text-sm font-semibold text-base-content/75 transition-all duration-200 hover:bg-base-200 hover:text-base-content';

  const actionBtnClass =
    'btn btn-ghost btn-sm h-10 min-h-10 w-10 rounded-full border border-base-300/60 bg-base-100 text-base-content shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-base-200 hover:shadow';

  const getNavClass = (path) => {
    const isActive = pathname === path;
    if (isActive) {
      return 'rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-content shadow-sm';
    }

    return navBaseClass;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-base-300/60 bg-base-100/90 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

      <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-3 md:px-6">
        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            className="btn btn-ghost btn-sm h-10 min-h-10 w-10 rounded-xl border border-base-300/60 md:hidden"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            <FiMenu className="text-lg" />
          </button>

          <Link to="/home" className="group inline-flex items-center gap-2 md:gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-content shadow-md shadow-primary/25 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
              <FaTelegramPlane className="text-sm" />
            </span>

            <div className="leading-none">
              <p className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-base-content/50 sm:block">Social Hub</p>
              <p className="text-sm font-extrabold tracking-tight sm:text-base md:text-xl">ChatWithFriend</p>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 rounded-full border border-base-300/60 bg-base-100 p-1 shadow-sm md:flex">
          <Link to="/" className={getNavClass('/')}>Home</Link>
          {!user ? (
            <>
              <Link to="/login" className={getNavClass('/login')}>Login</Link>
              <Link to="/signup" className={getNavClass('/signup')}>Signup</Link>
            </>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-sm rounded-full border border-base-300/70 bg-base-100 px-4 font-semibold text-base-content shadow-sm hover:bg-base-200"
            >
              Logout
            </button>
          )}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
          {user && (
            <>
              <button
                type="button"
                onClick={() => handleNavigate('/search')}
                className={actionBtnClass}
                aria-label="Search users"
              >
                <IoIosSearch className="text-xl" />
              </button>

              <button
                type="button"
                onClick={() => handleNavigate('/profile')}
                className={actionBtnClass}
                aria-label="Open profile"
              >
                <CiUser className="text-2xl" />
              </button>

              <Link
                to="/friendlist"
                className={`${actionBtnClass} hidden sm:inline-flex`}
                aria-label="Open friend list"
              >
                <FaTelegramPlane className="text-base" />
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            className={actionBtnClass}
            aria-label="Toggle theme"
          >
            {theme !== 'light' ? <FaMoon className="text-sm" /> : <FaSun className="text-lg" />}
          </button>
        </div>

        <div
          ref={dropdownRef}
          className={`absolute left-4 right-4 top-16 origin-top rounded-2xl border border-base-300/70 bg-base-100/95 p-3 shadow-2xl backdrop-blur transition-all duration-200 md:hidden ${isDropdownOpen ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'}`}
        >
          <Link
            to="/"
            className={`block rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${pathname === '/' ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}`}
            onClick={() => setIsDropdownOpen(false)}
          >
            Home
          </Link>

          {user && (
            <>
              <button
                type="button"
                onClick={() => handleNavigate('/search')}
                className={`mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors ${pathname === '/search' ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}`}
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('/profile')}
                className={`mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors ${pathname === '/profile' ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}`}
              >
                Profile
              </button>
              <Link
                to="/friendlist"
                className={`mt-1 block rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${pathname === '/friendlist' ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}`}
                onClick={() => setIsDropdownOpen(false)}
              >
                Friend List
              </Link>
            </>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                className={`mt-1 block rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${pathname === '/login' ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}`}
                onClick={() => setIsDropdownOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`mt-1 block rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${pathname === '/signup' ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}`}
                onClick={() => setIsDropdownOpen(false)}
              >
                Signup
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-base-200"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
