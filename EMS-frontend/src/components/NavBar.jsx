import React, { useEffect, useState } from 'react';
import { FaBars, FaBell, FaSearch, FaUserCircle, FaSun, FaMoon } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { logout, getUserRole, getUserInfo } from '../services/authService';

const Navbar = ({sidebarToggle, setSidebarToggle}) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    // Get user info from localStorage
    const info = getUserInfo();
    setUserInfo(info);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    // Clear authentication status using auth service
    logout();
    // Redirect to login page
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className={`bg-gray-800 px-4 py-3 flex justify-between items-center transition-all duration-300 ${sidebarToggle ? 'ml-20' : 'ml-64'}`}>
      <div className="flex items-center text-xl">
        <FaBars className="text-white me-4 cursor-pointer" onClick={()=> { 
          setSidebarToggle(!sidebarToggle)
          }}/>
        <span className="text-white font-semibold">
          {userInfo.role === 'admin' ? 'Admin Panel' : 
           userInfo.role === 'hr' ? 'HR Panel' : 
           'Employee Portal'} - Employee Management System
        </span>
      </div>

      <div className="flex items-center gap-x-4">
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-1 rounded bg-white text-black shadow outline-none w-64"
          />
        </div>

        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none"
          aria-label="Toggle theme"
        >
          {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
        </button>

        <div className='text-white'><FaBell className='w-6 h-6'></FaBell></div>
        <div className='relative'>
          <button onClick={toggleDropdown} className='text-white focus:outline-none flex items-center space-x-2'>
            <FaUserCircle className='w-6 h-6' />
            <span className="text-sm capitalize">{userInfo.role || 'User'}</span>
          </button>
          {dropdownOpen && (
            <div className='z-10 absolute bg-white rounded-lg shadow w-48 top-full right-0'>
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">{userInfo.fullName || 'User'}</p>
                <p className="text-xs text-gray-500">{userInfo.email}</p>
                <p className="text-xs text-gray-400 capitalize">{userInfo.role}</p>
              </div>
              <ul className='py-2 text-sm text-gray-950'>
                <li><a href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</a></li>
                <li><a href="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</a></li>
                <li><button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Log Out</button></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
