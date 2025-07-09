import React, { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import EmployeeLayout from './layouts/EmployeeLayout';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Leaves from './pages/Leaves';
import Salary from './pages/Salary';
import Resources from './pages/Resources';
import Training from './pages/Training';
import Settings from './pages/Settings';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import AddEmployeeForm from './components/AddEmployeeForm';
import EmployeeProfileView from './components/EmployeeProfileView';
import EditEmployeeForm from './components/EditEmployeeForm';
import AccessDenied from './components/AccessDenied';
import ErrorBoundary from './components/ErrorBoundary';
// Employee-specific pages
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeProfile from './pages/EmployeeProfile';
import EmployeeLeaves from './pages/EmployeeLeaves';
import EmployeeSalary from './pages/EmployeeSalary';
import EmployeeResources from './pages/EmployeeResources';
import EmployeeTraining from './pages/EmployeeTraining';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { isAuthenticated, getUserRole } from './services/authService';


const App = () => {
  // Protected route component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
  };

  // Admin-only route component
  const AdminRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    
    return getUserRole() === 'admin' ? children : <Navigate to="/access-denied" replace />;
  };

  // HR and Admin route component
  const HRRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    
    const userRole = getUserRole();
    return (userRole === 'hr' || userRole === 'admin') ? children : <Navigate to="/access-denied" replace />;
  };

  // Employee-only route component
  const EmployeeRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    
    return getUserRole() === 'employee' ? children : <Navigate to="/access-denied" replace />;
  };

  // Smart redirect component based on user role
  const SmartRedirect = () => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    
    const userRole = getUserRole();
    if (userRole === 'employee') {
      return <Navigate to="/employee-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  };

  const router = createBrowserRouter(createRoutesFromElements(
    <>
      {/* Root route redirects based on user role */}
      <Route path="/" element={<SmartRedirect />} />
      
      {/* Login route */}
      <Route path="/login" element={<Login />} />
      
      {/* Access Denied */}
      <Route path="/access-denied" element={<AccessDenied />} />
      
      {/* Admin/HR routes under MainLayout */}
      <Route 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
        errorElement={<ErrorBoundary />}
      >    
        <Route path="dashboard" element={
          <HRRoute>
            <Dashboard />
          </HRRoute>
        } />
        <Route path="employees" element={
          <HRRoute>
            <Employees />
          </HRRoute>
        } />
        <Route path="departments" element={
          <HRRoute>
            <Departments />
          </HRRoute>
        } />
        <Route path="leaves" element={
          <HRRoute>
            <Leaves />
          </HRRoute>
        } />
        <Route path="salary" element={
          <HRRoute>
            <Salary />
          </HRRoute>
        } />
        <Route path="resources" element={
          <HRRoute>
            <Resources />
          </HRRoute>
        } />
        <Route path="training" element={
          <HRRoute>
            <Training />
          </HRRoute>
        } />
        {/* Settings - Admin Only */}
        <Route path="settings" element={
          <AdminRoute>
            <Settings />
          </AdminRoute>
        } />
        <Route path="admin-profile/:id" element={
          <HRRoute>
            <ProfilePage />
          </HRRoute>
        } />
        <Route path="profile/:eid" element={
          <HRRoute>
            <EmployeeProfileView />
          </HRRoute>
        } />
        <Route path="employees/edit/:eid" element={
          <HRRoute>
            <EditEmployeeForm />
          </HRRoute>
        } />
        <Route path="add-employee" element={
          <HRRoute>
            <AddEmployeeForm />
          </HRRoute>
        } />
      </Route>

      {/* Employee routes under EmployeeLayout */}
      <Route 
        element={
          <EmployeeRoute>
            <EmployeeLayout />
          </EmployeeRoute>
        }
        errorElement={<ErrorBoundary />}
      >    
        <Route path="employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="employee-profile" element={<EmployeeProfile />} />
        <Route path="employee-leaves" element={<EmployeeLeaves />} />
        <Route path="employee-salary" element={<EmployeeSalary />} />
        <Route path="employee-resources" element={<EmployeeResources />} />
        <Route path="employee-training" element={<EmployeeTraining />} />
      </Route>
      
      {/* Catch-all route for 404 errors */}
      <Route path="*" element={<ErrorBoundary />} />
    </>
  ))

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeProvider>
  );
};

export default App;
