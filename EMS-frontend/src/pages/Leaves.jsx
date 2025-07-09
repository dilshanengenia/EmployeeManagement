import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../services/apiClient';
import Modal from '../components/Modal';

const Leaves = () => {
  const { sidebarToggle } = useOutletContext();
  const [activeTab, setActiveTab] = useState('leaveTypes');
  const [isOpen, setIsOpen] = useState(false);
  const [modalDetails, setModalDetails] = useState({});
  const [selectedObject, setSelectedObject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Data states
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [leaveApplications, setLeaveApplications] = useState([]);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (activeTab === 'leaveTypes') {
          const response = await apiClient.get('/leave_types/');
          setLeaveTypes(response.data);
        } else if (activeTab === 'leaveBalances') {
          const response = await apiClient.get('/employee_leave_balances/');
          setLeaveBalances(response.data);
        } else if (activeTab === 'leaveApplications') {
          const response = await apiClient.get('/leave_applications/');
          setLeaveApplications(response.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleIsOpen = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      // Refresh data when modal closes
      window.location.reload();
    }
  };

  // Leave Type handlers
  const handleAddLeaveType = () => {
    setSelectedObject(null);
    setModalDetails({
      title: "Add New Leave Type",
      component: "LeaveTypeForm",
      buttonName: "Add"
    });
    handleIsOpen();
  };

  const handleEditLeaveType = (leaveType) => {
    setSelectedObject(leaveType);
    setModalDetails({
      title: "Edit Leave Type",
      component: "LeaveTypeForm",
      buttonName: "Save"
    });
    handleIsOpen();
  };

  const handleDeleteLeaveType = (leaveType) => {
    setSelectedObject(leaveType);
    setModalDetails({
      title: "Delete Leave Type",
      component: "DeleteForm",
      objectName: "Leave Type",
      objectId: leaveType.lid
    });
    handleIsOpen();
  };

  // Leave Balance handlers
  const handleAddLeaveBalance = () => {
    setSelectedObject(null);
    setModalDetails({
      title: "Add Employee Leave Balance",
      component: "LeaveBalanceForm",
      buttonName: "Add"
    });
    handleIsOpen();
  };

  const handleEditLeaveBalance = (balance) => {
    setSelectedObject(balance);
    setModalDetails({
      title: "Edit Leave Balance",
      component: "LeaveBalanceForm",
      buttonName: "Save"
    });
    handleIsOpen();
  };

  const handleDeleteLeaveBalance = (balance) => {
    setSelectedObject(balance);
    setModalDetails({
      title: "Delete Leave Balance",
      component: "DeleteForm",
      objectName: "Leave Balance",
      objectId: balance.eid
    });
    handleIsOpen();
  };

  // Leave Application handlers
  const handleAddLeaveApplication = () => {
    setSelectedObject(null);
    setModalDetails({
      title: "Submit Leave Application",
      component: "LeaveApplicationForm",
      buttonName: "Submit"
    });
    handleIsOpen();
  };

  const handleUpdateLeaveStatus = (application) => {
    setSelectedObject(application);
    setModalDetails({
      title: "Update Leave Status",
      component: "LeaveStatusUpdateForm",
      buttonName: "Update Status"
    });
    handleIsOpen();
  };

  const handleDeleteLeaveApplication = (application) => {
    setSelectedObject(application);
    setModalDetails({
      title: "Delete Leave Application",
      component: "DeleteForm",
      objectName: "Leave Application",
      objectId: `${application.eid}_${application.fromdate.replaceAll('-', '')}`
    });
    handleIsOpen();
  };

  // Filter data based on search term
  const filteredLeaveTypes = leaveTypes.filter(type =>
    searchTerm === "" || 
    type.lid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.leavetype.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLeaveBalances = leaveBalances.filter(balance =>
    searchTerm === "" || 
    balance.eid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLeaveApplications = leaveApplications.filter(application =>
    searchTerm === "" || 
    application.eid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    application.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${sidebarToggle ? "ml-20": " ml-64 "} px-6 py-4`}>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-black mt-8 mb-6 text-center border-b pb-2">
        Leave Management
      </h1>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="mr-2">
            <button 
              onClick={() => setActiveTab('leaveTypes')}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                activeTab === 'leaveTypes' 
                  ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500' 
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 002-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
              </svg>
              Leave Types
            </button>
          </li>
          <li className="mr-2">
            <button 
              onClick={() => setActiveTab('leaveBalances')}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                activeTab === 'leaveBalances' 
                  ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500' 
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
              Leave Balances
            </button>
          </li>
          <li className="mr-2">
            <button 
              onClick={() => setActiveTab('leaveApplications')}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                activeTab === 'leaveApplications' 
                  ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500' 
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
              Leave Applications
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {/* Leave Types Tab */}
        {activeTab === 'leaveTypes' && (
          <div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-3">
              <div className="pb-4 bg-white dark:bg-gray-900 pt-3">
                <div className="flex justify-between items-center">
                  <div className="relative flex items-center mt-2 ml-4">
                    <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      id="leavetype-search" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                      placeholder="Search by ID or name..."
                    />
                  </div>
                  <button 
                    onClick={handleAddLeaveType} 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Leave Type
                  </button>
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-4">Loading leave types...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">Leave ID</th>
                        <th scope="col" className="px-6 py-3">Leave Type</th>
                        <th scope="col" className="px-6 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeaveTypes.length > 0 ? (
                        filteredLeaveTypes.map((leaveType) => (
                          <tr key={leaveType.lid} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-6 py-4">{leaveType.lid}</td>
                            <td className="px-6 py-4">{leaveType.leavetype}</td>
                            <td className="px-6 py-4 flex space-x-2">
                              <button 
                                onClick={() => handleEditLeaveType(leaveType)} 
                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteLeaveType(leaveType)} 
                                className="font-medium text-red-600 dark:text-red-500 hover:underline"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="px-6 py-4 text-center">No leave types found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Leave Balances Tab */}
        {activeTab === 'leaveBalances' && (
          <div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-3">
              <div className="pb-4 bg-white dark:bg-gray-900 pt-3">
                <div className="flex justify-between items-center">
                  <div className="relative flex items-center mt-2 ml-4">  
                    <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      id="balance-search" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                      placeholder="Search by employee ID..."
                    />
                  </div>
                  <button 
                    onClick={handleAddLeaveBalance}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Leave Balance
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-4">Loading leave balances...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">Employee ID</th>
                        <th scope="col" className="px-6 py-3">Total Annual Leaves</th>
                        <th scope="col" className="px-6 py-3">Annual Balance</th>
                        <th scope="col" className="px-6 py-3">Total Casual Leaves</th>
                        <th scope="col" className="px-6 py-3">Casual Balance</th>
                        <th scope="col" className="px-6 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeaveBalances.length > 0 ? (
                        filteredLeaveBalances.map((balance) => (
                          <tr key={balance.eid} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-6 py-4">{balance.eid}</td>
                            <td className="px-6 py-4">{balance.totalannualleaves}</td>
                            <td className="px-6 py-4">{balance.annualleavebalance}</td>
                            <td className="px-6 py-4">{balance.totalcasualleaves}</td>
                            <td className="px-6 py-4">{balance.casualleavebalance}</td>
                            <td className="px-6 py-4 flex space-x-2">
                              <button 
                                onClick={() => handleEditLeaveBalance(balance)} 
                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteLeaveBalance(balance)} 
                                className="font-medium text-red-600 dark:text-red-500 hover:underline"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center">No leave balances found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Leave Applications Tab */}
        {activeTab === 'leaveApplications' && (
          <div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-3">
              <div className="pb-4 bg-white dark:bg-gray-900 pt-3">
                <div className="flex justify-between items-center">
                  <div className="relative flex items-center mt-2 ml-4">  
                    <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      id="application-search" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                      placeholder="Search by employee ID or status..."
                    />
                  </div>
                  <button 
                    onClick={handleAddLeaveApplication}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Submit Leave Application
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-4">Loading leave applications...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">Employee ID</th>
                        <th scope="col" className="px-6 py-3">Leave ID</th>
                        <th scope="col" className="px-6 py-3">From Date</th>
                        <th scope="col" className="px-6 py-3">To Date</th>
                        <th scope="col" className="px-6 py-3">No of Days</th>
                        <th scope="col" className="px-6 py-3">Description</th>
                        <th scope="col" className="px-6 py-3">Applied Date</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Priority</th>
                        <th scope="col" className="px-6 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeaveApplications.length > 0 ? (
                        filteredLeaveApplications.map((application, index) => (
                          <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-6 py-4">{application.eid}</td>
                            <td className="px-6 py-4">{application.lid}</td>
                            <td className="px-6 py-4">{application.fromdate}</td>
                            <td className="px-6 py-4">{application.todate}</td>
                            <td className="px-6 py-4">{application.noofdays}</td>
                            <td className="px-6 py-4">{application.description}</td>
                            <td className="px-6 py-4">{application.applieddate}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                application.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {application.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                application.priority === 'High' ? 'bg-red-100 text-red-800' :
                                application.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {application.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4 flex space-x-2">
                              <button 
                                onClick={() => handleUpdateLeaveStatus(application)} 
                                className="font-medium text-green-600 dark:text-green-500 hover:underline"
                              >
                                Update Status
                              </button>
                              <button 
                                onClick={() => handleDeleteLeaveApplication(application)} 
                                className="font-medium text-red-600 dark:text-red-500 hover:underline"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="10" className="px-6 py-4 text-center">No leave applications found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {isOpen && <Modal 
          sidebarToggle={sidebarToggle} 
          handleIsOpen={handleIsOpen} 
          modelDetails={modalDetails} 
          selectedObject={selectedObject}
      />}
    </div>
  )
}

export default Leaves