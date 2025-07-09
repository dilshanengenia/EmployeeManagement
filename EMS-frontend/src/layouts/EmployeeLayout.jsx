import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import EmployeeSideBar from '../components/EmployeeSideBar';
import Navbar from '../components/NavBar';

const EmployeeLayout = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <EmployeeSideBar sidebarToggle={sidebarToggle} />
      <div className="flex-1 flex flex-col">
        <Navbar 
          sidebarToggle={sidebarToggle} 
          setSidebarToggle={setSidebarToggle} 
        />
        <main className="flex-1">
          <Outlet context={{ sidebarToggle }} />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
