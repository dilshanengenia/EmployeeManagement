import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar';
import { Outlet } from 'react-router-dom'

const MainLayout = () => {

  const [sidebarToggle, setSidebarToggle] = useState(false);

  return (
    <>
        <div className="flex">
        <SideBar sidebarToggle={sidebarToggle} />
        
        <div className="flex-1">
            <NavBar sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />
        </div>
        </div>
        
        <Outlet context={{ sidebarToggle }} />
    </>
  )
} 

export default MainLayout