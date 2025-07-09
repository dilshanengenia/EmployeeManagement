import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUser,
  FaPlane,
  FaMoneyBillAlt,
  FaLaptop,
  FaGraduationCap,
  FaChartBar,
} from 'react-icons/fa';

const EmployeeSideBar = ({ sidebarToggle }) => {
  const [userRole, setUserRole] = useState('');
  
  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem('userRole') || '';
    setUserRole(role);
  }, []);

  // Define employee menu items
  const employeeMenuItems = [
    { icon: <FaChartBar />, label: 'Dashboard', path: '/employee-dashboard' },
    { icon: <FaUser />, label: 'My Profile', path: '/employee-profile' },
    { icon: <FaPlane />, label: 'My Leaves', path: '/employee-leaves' },
    { icon: <FaMoneyBillAlt />, label: 'My Salary', path: '/employee-salary' },
    { icon: <FaLaptop />, label: 'My Resources', path: '/employee-resources' },
    { icon: <FaGraduationCap />, label: 'Training', path: '/employee-training' },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 transition-all duration-300
      ${sidebarToggle ? 'w-20' : 'w-64'} overflow-hidden z-50`}
    >
      {/* Logo or Title */}
      <div className="flex items-center justify-start h-16 px-4 overflow-hidden">
        {!sidebarToggle && (
          <h1 className="text-white text-lg font-bold whitespace-nowrap overflow-hidden">
            Employee Portal
          </h1>
        )}
      </div>

      {/* Menu Items */}
      <ul className="text-white font-medium mt-4">
        {employeeMenuItems.map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              className="flex items-center mb-2 px-4 py-2 hover:bg-blue-500 rounded transition-colors mx-2"
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

export default EmployeeSideBar;
