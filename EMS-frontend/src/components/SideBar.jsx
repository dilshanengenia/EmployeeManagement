import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaChild,
  FaBuilding,
  FaChartBar,
  FaMoneyBillAlt,
  FaPlane,
  FaWhmcs,
  FaLaptop,
  FaGraduationCap,
} from 'react-icons/fa';

const SideBar = ({ sidebarToggle }) => {
  const [userRole, setUserRole] = useState('');
  
  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem('userRole') || '';
    setUserRole(role);
    
    // Set up event listener to update role if it changes
    const handleStorageChange = () => {
      const updatedRole = localStorage.getItem('userRole') || '';
      setUserRole(updatedRole);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Define menu items
  const allMenuItems = [
    { icon: <FaChartBar />, label: 'Dashboard', path: '/dashboard', roles: ['admin', 'hr'] },
    { icon: <FaChild />, label: 'Employees', path: '/employees', roles: ['admin', 'hr'] },
    { icon: <FaBuilding />, label: 'Departments', path: '/departments', roles: ['admin', 'hr'] },
    { icon: <FaPlane />, label: 'Leaves', path: '/leaves', roles: ['admin', 'hr'] },
    { icon: <FaMoneyBillAlt />, label: 'Salary', path: '/salary', roles: ['admin', 'hr'] },
    { icon: <FaLaptop />, label: 'Resources', path: '/resources', roles: ['admin', 'hr'] },
    { icon: <FaGraduationCap />, label: 'Training', path: '/training', roles: ['admin', 'hr'] },
    { icon: <FaWhmcs />, label: 'Settings', path: '/settings', roles: ['admin'] }, // Admin only
  ];

  // Filter menu items based on user role
  const filteredMenuItems = allMenuItems.filter(item => item.roles.includes(userRole));
  
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 transition-all duration-300
      ${sidebarToggle ? 'w-20' : 'w-64'} overflow-hidden z-50`}
    >
      {/* Logo or Title */}
      <div className="flex items-center justify-start h-16 px-4 overflow-hidden">
        {!sidebarToggle && (
          <h1 className="text-white text-lg font-bold whitespace-nowrap overflow-hidden">
            {userRole === 'admin' ? 'Admin Dashboard' : 'HR Dashboard'}
          </h1>
        )}
      </div>

      {/* Menu Items */}
      <ul className="text-white font-medium mt-4">
       {filteredMenuItems.map((item, index) => (
        <li key={index}>
          <Link
            to={item.path}
            className="flex items-center mb-2 px-4 py-2 hover:bg-blue-500 rounded transition-colors"
          >
            <span className="text-xl">{item.icon}</span>
            {!sidebarToggle && <span className="ml-4">{item.label}</span>}
          </Link>
        </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
