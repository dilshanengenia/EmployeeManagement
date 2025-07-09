import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import apiClient from '../services/apiClient';
import { FaPlus, FaClock, FaCheckCircle, FaBan, FaCalendarAlt } from 'react-icons/fa';

const EmployeeLeaves = () => {
  const { sidebarToggle } = useOutletContext();
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalDetails, setModalDetails] = useState({
    title: "",
    component: "",
    buttonName: ""
  });

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchMyLeaveApplications();
  }, []);

  const fetchMyLeaveApplications = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/employee_leave_applications/${userId}/`);
      setLeaveApplications(response.data);
    } catch (error) {
      console.error('Error fetching leave applications:', error);
      toast.error('Failed to load leave applications');
    } finally {
      setLoading(false);
    }
  };

  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleApplyLeave = () => {
    setModalDetails({
      title: "Apply for Leave",
      component: "LeaveApplicationForm",
      buttonName: "Submit Application"
    });
    handleIsOpen();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <FaCheckCircle className="text-green-500" />;
      case 'Pending':
        return <FaClock className="text-yellow-500" />;
      case 'Rejected':
        return <FaBan className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className={`${sidebarToggle ? "ml-20" : "ml-64"} p-6`}>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-black mt-4 mb-6 text-center border-b pb-2">
        My Leaves
      </h1>

      {/* Apply Leave Button */}
      <div className="mb-6">
        <button
          onClick={handleApplyLeave}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2"
        >
          <FaPlus />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Applications Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">My Leave Applications</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Leave Type</th>
                  <th className="px-6 py-3">From Date</th>
                  <th className="px-6 py-3">To Date</th>
                  <th className="px-6 py-3">Days</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Applied Date</th>
                  <th className="px-6 py-3">Priority</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveApplications.length > 0 ? (
                  leaveApplications.map((application, index) => (
                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {application.lid}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(application.fromdate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(application.todate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{application.noofdays}</td>
                      <td className="px-6 py-4">{application.description}</td>
                      <td className="px-6 py-4">
                        {new Date(application.applieddate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {application.priority}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(application.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No leave applications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isOpen && (
        <Modal 
          sidebarToggle={sidebarToggle} 
          handleIsOpen={handleIsOpen} 
          modelDetails={modalDetails} 
          selectedObject={{ eid: userId }}
        />
      )}
    </div>
  );
};

export default EmployeeLeaves;
