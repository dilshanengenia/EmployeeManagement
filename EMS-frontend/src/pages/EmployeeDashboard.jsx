import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import apiClient from '../services/apiClient';
import {
  FaChild,
  FaBuilding,
  FaMoneyBillAlt,
  FaCheckCircle,
  FaClock,
  FaBan,
  FaArchive,
  FaWhmcs,
  FaPlane,
  FaLaptop,
  FaCalendarAlt,
  FaUsers,
} from 'react-icons/fa';

const EmployeeDashboard = () => {
  const { sidebarToggle } = useOutletContext();
  const navigate = useNavigate();

  const [employeeData, setEmployeeData] = useState(null);
  const [salaryData, setSalaryData] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployeeDashboardData();
  }, []);

  const fetchEmployeeDashboardData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        setError('User ID not found in session');
        return;
      }

      // Fetch employee details
      try {
        const employeeResponse = await apiClient.get(`/employee_details/${userId}/`);
        setEmployeeData(employeeResponse.data);
      } catch (err) {
        console.log('Error fetching employee data:', err);
      }

      // Fetch salary data
      try {
        const salaryResponse = await apiClient.get(`/salary/${userId}/`);
        setSalaryData(salaryResponse.data);
      } catch (err) {
        console.log('No salary data found for this employee');
      }

      // Fetch leave balance
      try {
        const leaveResponse = await apiClient.get(`/employee_leave_balances/${userId}/`);
        setLeaveBalance(leaveResponse.data);
      } catch (err) {
        console.log('No leave balance data found for this employee');
      }

      // Fetch leave applications for this employee
      try {
        const leaveAppsResponse = await apiClient.get(`/employee_leave_applications/${userId}/`);
        setLeaveApplications(leaveAppsResponse.data);
      } catch (err) {
        console.log('No leave applications found for this employee');
        setLeaveApplications([]);
      }

      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate leave statistics
  const getLeaveStatistics = () => {
    if (!leaveApplications || leaveApplications.length === 0) {
      return { applied: 0, approved: 0, pending: 0, rejected: 0 };
    }
    
    return leaveApplications.reduce((acc, leave) => {
      acc.applied++;
      if (leave.status === 'Approved') acc.approved++;
      else if (leave.status === 'Pending') acc.pending++;
      else if (leave.status === 'Rejected') acc.rejected++;
      return acc;
    }, { applied: 0, approved: 0, pending: 0, rejected: 0 });
  };

  // Format currency
  const formatCurrency = (amount) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
    return `Rs. ${formatted}`;
  };

  // Quick action handlers
  const handleApplyLeave = () => {
    navigate('/employee-leaves');
  };

  const handleViewSalary = () => {
    navigate('/employee-salary');
  };

  const handleViewResources = () => {
    navigate('/employee-resources');
  };

  const handleViewProfile = () => {
    navigate('/employee-profile');
  };

  if (loading) {
    return (
      <div className={`${sidebarToggle ? "ml-20" : "ml-64"} p-8 bg-gray-100 dark:bg-gray-900 min-h-screen`}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${sidebarToggle ? "ml-20" : "ml-64"} p-8 bg-gray-100 dark:bg-gray-900 min-h-screen`}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  const leaveStats = getLeaveStatistics();

  return (
    <div className={`${sidebarToggle ? "ml-20" : "ml-64"} p-8 bg-gray-100 dark:bg-gray-900 min-h-screen`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Welcome back, {employeeData?.fullname || 'Employee'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Employee ID: {employeeData?.eid} | {employeeData?.designation} at {employeeData?.department}
        </p>
      </div>

      {/* Key Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div 
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={handleViewProfile}
        >
          <div className="flex items-center space-x-4">
            <FaChild className="text-3xl text-blue-500" />
            <div>
              <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300">My Profile</h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">View & Edit</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <FaBuilding className="text-3xl text-green-500" />
            <div>
              <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Department</h5>
              <p className="text-sm font-medium text-gray-800 dark:text-white">{employeeData?.department || 'Not Set'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{employeeData?.designation}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <FaMoneyBillAlt className="text-3xl text-yellow-500" />
            <div>
              <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Net Salary</h5>
              <p className="text-lg font-bold text-gray-800 dark:text-white">
                {salaryData ? formatCurrency(salaryData.netsalary) : 'Not Set'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <FaUsers className="text-3xl text-purple-500" />
            <div>
              <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Status</h5>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                employeeData?.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {employeeData?.status || 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Applications Status */}
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">My Leave Applications</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <FaWhmcs className="text-3xl text-blue-500" />
            <div>
              <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Applied</h5>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{leaveStats.applied}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <FaCheckCircle className="text-3xl text-green-500" />
            <div>
              <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Approved</h5>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{leaveStats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <FaClock className="text-3xl text-yellow-500" />
            <div>
              <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Pending</h5>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{leaveStats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <FaBan className="text-3xl text-red-500" />
            <div>
              <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Rejected</h5>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{leaveStats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Information */}
      {salaryData && (
        <>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Salary Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-center">
                <FaMoneyBillAlt className="text-4xl text-green-500 mx-auto mb-3" />
                <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Basic Salary</h5>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {formatCurrency(salaryData.basicsalary)}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-center">
                <FaMoneyBillAlt className="text-4xl text-blue-500 mx-auto mb-3" />
                <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Allowances</h5>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {formatCurrency(salaryData.allowances)}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-center">
                <FaMoneyBillAlt className="text-4xl text-purple-500 mx-auto mb-3" />
                <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Net Salary</h5>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(salaryData.netsalary)}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Quick Actions Section */}
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div 
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer transform hover:scale-105"
          onClick={handleApplyLeave}
        >
          <div className="text-center">
            <FaPlane className="text-4xl text-blue-500 mx-auto mb-3" />
            <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Apply for Leave</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">Submit a new leave application</p>
          </div>
        </div>

        <div 
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer transform hover:scale-105"
          onClick={handleViewSalary}
        >
          <div className="text-center">
            <FaMoneyBillAlt className="text-4xl text-green-500 mx-auto mb-3" />
            <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">View Salary</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">Check salary details and history</p>
          </div>
        </div>

        <div 
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer transform hover:scale-105"
          onClick={handleViewResources}
        >
          <div className="text-center">
            <FaLaptop className="text-4xl text-purple-500 mx-auto mb-3" />
            <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">My Resources</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">View allocated resources</p>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Recent Activities</h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        {leaveApplications && leaveApplications.length > 0 ? (
          <div className="space-y-4">
            {leaveApplications.slice(0, 3).map((leave, index) => (
              <div key={index} className={`flex items-center space-x-4 p-3 border-l-4 ${
                leave.status === 'Approved' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                leave.status === 'Pending' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                'border-red-500 bg-red-50 dark:bg-red-900/20'
              }`}>
                {leave.status === 'Approved' ? <FaCheckCircle className="text-green-500" /> :
                 leave.status === 'Pending' ? <FaClock className="text-yellow-500" /> :
                 <FaBan className="text-red-500" />}
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    Leave application {leave.status.toLowerCase()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    From {new Date(leave.fromdate).toLocaleDateString()} to {new Date(leave.todate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent activities</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
