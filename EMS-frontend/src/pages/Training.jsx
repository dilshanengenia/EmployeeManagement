import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import { FaCheckCircle, FaTimesCircle, FaClock, FaMoneyBillWave, FaFileAlt, FaEdit, FaExternalLinkAlt } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:8000';

// Create a custom axios instance with error handling
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // Add timeouts to prevent long-pending requests
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  config => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for global error handling
apiClient.interceptors.response.use(
  response => {
    console.log(`Received response from ${response.config.url}:`, response.status);
    return response;
  },
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error:', error);
      toast.error('Server connection error. Please check if the backend server is running.');
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.status, error.response.data);
      
      if (error.response.status === 404) {
        toast.error(`Resource not found: ${error.config.url}`);
      } else if (error.response.status === 500) {
        toast.error('Server error. Please check server logs for details.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      toast.error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      toast.error(`Error: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

const Training = () => {
  const { sidebarToggle } = useOutletContext();
  
  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [modelDetails, setModelDetails] = useState({});
  const [selectedObject, setSelectedObject] = useState(null);

  // Data state
  const [trainingBudgets, setTrainingBudgets] = useState([]);
  const [trainingRequests, setTrainingRequests] = useState([]);
  const [budgetRequests, setBudgetRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('budgets');
  const [updatingStatus, setUpdatingStatus] = useState({});

  // Fetch training budgets and requests on component mount
  useEffect(() => {
    fetchTrainingBudgets();
    fetchTrainingRequests();
    fetchBudgetRequests();
  }, []);

  const fetchTrainingBudgets = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/training_budgets/');
      setTrainingBudgets(response.data);
    } catch (error) {
      console.error('Error fetching training budgets:', error);
      toast.error('Failed to load training budgets');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainingRequests = async () => {
    setLoading(true);
    try {
      console.log('Fetching training requests...');
      const response = await apiClient.get('/training_requests/');
      console.log('Training requests data:', response.data);
      
      if (Array.isArray(response.data)) {
        setTrainingRequests(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        toast.error('Received invalid training requests data');
        setTrainingRequests([]);
      }
    } catch (error) {
      console.error('Error fetching training requests:', error);
      if (error.response) {
        console.error('Response error details:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      toast.error(`Failed to load training requests: ${error.message}`);
      setTrainingRequests([]); // Set empty array on error to prevent UI issues
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgetRequests = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/training_requests/');
      setBudgetRequests(response.data);
    } catch (error) {
      console.error('Error fetching budget requests:', error);
      toast.error('Failed to load budget requests');
    } finally {
      setLoading(false);
    }
  };

  // Handle status change for training requests
  const handleStatusChange = async (requestId, newStatus) => {
    setUpdatingStatus(prev => ({ ...prev, [requestId]: true }));
    
    try {
      console.log(`Updating status for request ${requestId} to ${newStatus}`);
      
      // Find the current request data
      const request = trainingRequests.find(r => r.id === requestId);
      if (!request) {
        toast.error('Request not found');
        console.error(`Request with id ${requestId} not found in local state`);
        return;
      }
      
      // Set granted date to today if status is being changed to Approved
      const today = new Date().toISOString().split('T')[0];
      
      // Create a clean request object with only the needed fields
      const cleanRequest = {
        id: request.id,
        eid: request.eid,
        requestedamount: request.requestedamount,
        reason: request.reason,
        applieddate: request.applieddate,
        status: newStatus,
        granteddate: newStatus === 'Approved' && (!request.granteddate || request.granteddate === 'null') ? today : request.granteddate,
        proofdocumenturl: request.proofdocumenturl || null
      };
      
      console.log('Sending update request with data:', cleanRequest);
      
      // Make API call with detailed error handling
      try {
        // Add delay to ensure server has time to process
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const response = await apiClient.put(`/training_requests/${requestId}/`, cleanRequest);
        console.log('Update response:', response.data);
        
        // Make a clean copy of the response data
        const updatedData = { 
          ...response.data,
          status: newStatus // Ensure the status is properly updated in UI
        };
        
        // Update local state with the response data from the server
        setTrainingRequests(prev => 
          prev.map(r => r.id === requestId ? updatedData : r)
        );
        
        toast.success(`Request status updated to ${newStatus}`);
        
        // Refresh the list after a short delay to ensure consistency
        setTimeout(() => fetchTrainingRequests(), 1000);
        
      } catch (apiError) {
        console.error('API error details:', {
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data,
          url: apiError.config?.url,
          message: apiError.message
        });
        
        if (apiError.response?.status === 404) {
          toast.error(`Request not found on server. ID: ${requestId}`);
        } else if (apiError.response?.status === 500) {
          toast.error(`Server error occurred. Please check server logs.`);
        } else {
          toast.error(`Failed to update status: ${apiError.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error handling status change:', error);
      toast.error('An unexpected error occurred while updating status');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleAddTrainingBudget = () => {
    setModelDetails({
      title: 'Add Training Budget',
      component: 'TrainingBudgetForm',
      buttonName: 'Add Budget'
    });
    setSelectedObject(null);
    setIsOpen(true);
  };

  const handleEditTrainingBudget = (budget) => {
    setModelDetails({
      title: 'Edit Training Budget',
      component: 'TrainingBudgetForm',
      buttonName: 'Update Budget'
    });
    setSelectedObject(budget);
    setIsOpen(true);
  };

  const handleAddTrainingRequest = () => {
    setModelDetails({
      title: 'Add Training Request',
      component: 'TrainingRequestForm',
      buttonName: 'Add Request'
    });
    setSelectedObject(null);
    setIsOpen(true);
  };

  const handleEditTrainingRequest = (request) => {
    setModelDetails({
      title: 'Edit Training Request',
      component: 'TrainingRequestForm',
      buttonName: 'Update Request'
    });
    setSelectedObject(request);
    setIsOpen(true);
  };

  const handleDeleteTrainingBudget = (eid) => {
    setModelDetails({
      title: 'Delete Training Budget',
      component: 'DeleteForm',
      objectName: 'training_budgets',
      objectId: eid
    });
    console.log(`Setting up deletion for training budget with id ${eid}`);
    setIsOpen(true);
  };

  const handleDeleteTrainingRequest = (id) => {
    setModelDetails({
      title: 'Delete Training Request',
      component: 'DeleteForm',
      objectName: 'training_requests',
      objectId: id
    });
    console.log(`Setting up deletion for training request with id ${id}`);
    setIsOpen(true);
  };

  const handleEditBudgetRequest = (request) => {
    setModelDetails({
      title: 'Edit Budget Request',
      component: 'TrainingBudgetRequestForm',
      buttonName: 'Update Request'
    });
    setSelectedObject(request);
    setIsOpen(true);
  };

  const handleUpdateBudgetRequestStatus = async (requestId, newStatus) => {
    // Set updating status for this request
    setUpdatingStatus(prev => ({ ...prev, [requestId]: true }));
    
    try {
      console.log(`Updating request ${requestId} status to ${newStatus}`);
      
      // Find the current request data
      const request = budgetRequests.find(r => r.id === requestId);
      if (!request) {
        toast.error('Budget request not found');
        console.error(`Budget request with id ${requestId} not found in local state`);
        return;
      }
      
      // Set granted date to today if status is being changed to Approved
      const today = new Date().toISOString().split('T')[0];
      
      // Create a clean request object with only the needed fields
      const cleanRequest = {
        id: request.id,
        eid: request.eid,
        requestedamount: request.requestedamount,
        reason: request.reason,
        applieddate: request.applieddate,
        status: newStatus,
        granteddate: newStatus === 'Approved' && (!request.granteddate || request.granteddate === 'null') ? today : request.granteddate,
        proofdocumenturl: request.proofdocumenturl || null
      };
      
      console.log('Sending budget request update with data:', cleanRequest);
      
      // Make API call with detailed error handling
      try {
        // Add delay to ensure server has time to process
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const response = await apiClient.put(`/training_requests/${requestId}/`, cleanRequest);
        console.log('Update response:', response.data);
        
        // Make a clean copy of the response data
        const updatedData = { 
          ...response.data,
          status: newStatus // Ensure the status is properly updated in UI
        };
        
        // Update local state with the response data from the server
        setBudgetRequests(prev => 
          prev.map(r => r.id === requestId ? updatedData : r)
        );
        
        toast.success(`Budget request status updated to ${newStatus}`);
        
        // Refresh the list after a short delay to ensure consistency
        setTimeout(() => fetchBudgetRequests(), 1000);
        
        // If it was approved, also refresh training budgets to show updated amounts
        if (newStatus === 'Approved') {
          setTimeout(() => fetchTrainingBudgets(), 1000);
        }
        
      } catch (apiError) {
        console.error('API error details:', {
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data,
          url: apiError.config?.url,
          message: apiError.message
        });
        
        if (apiError.response?.status === 404) {
          toast.error(`Budget request not found on server. ID: ${requestId}`);
        } else if (apiError.response?.status === 500) {
          toast.error(`Server error occurred. Please check server logs.`);
        } else {
          toast.error(`Failed to update status: ${apiError.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error handling status change:', error);
      toast.error('An unexpected error occurred while updating status');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleIsOpen = () => {
    setIsOpen(!isOpen);
    // Refresh data after modal is closed
    if (isOpen) {
      fetchTrainingBudgets();
      fetchTrainingRequests();
    }
  };

  return (
    <div className={`${sidebarToggle ? "ml-20": " ml-64 "} px-6 py-4`}>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-black mt-8 mb-6 text-center border-b pb-2">
        Training Management
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'budgets' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('budgets')}
        >
          Training Budgets
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'requests' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('requests')}
        >
          Training Requests
        </button>
      </div>

      {/* Training Budgets Table */}
      {activeTab === 'budgets' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Training Budget Records</h2>
            <button
              onClick={handleAddTrainingBudget}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
              </svg>
              Add New Budget
            </button>
          </div>

          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : trainingBudgets.length === 0 ? (
            <p className="text-center py-4">No training budget records found.</p>
          ) : (
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-white uppercase bg-blue-600">
                  <tr>
                    <th scope="col" className="py-3 px-6">Employee ID</th>
                    <th scope="col" className="py-3 px-6">Budget Rate (%)</th>
                    <th scope="col" className="py-3 px-6">Budget Amount</th>
                    <th scope="col" className="py-3 px-6">Remaining Amount</th>
                    <th scope="col" className="py-3 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trainingBudgets.map(budget => (
                    <tr key={budget.eid} className="bg-white border-b hover:bg-gray-50">
                      <td className="py-4 px-6">{budget.eid}</td>
                      <td className="py-4 px-6">{budget.trainingbudgetrate}%</td>
                      <td className="py-4 px-6">${budget.trainingbudgetamount}</td>
                      <td className="py-4 px-6">${budget.remainingamount}</td>
                      <td className="py-4 px-6 flex space-x-2">
                        <button
                          onClick={() => handleEditTrainingBudget(budget)}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTrainingBudget(budget.eid)}
                          className="font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Training Requests Table */}
      {activeTab === 'requests' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Training Request Records</h2>
            <button
              onClick={handleAddTrainingRequest}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
              </svg>
              Add New Request
            </button>
          </div>

          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : trainingRequests.length === 0 ? (
            <p className="text-center py-4">No training request records found.</p>
          ) : (
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-white uppercase bg-blue-600">
                  <tr>
                    <th scope="col" className="py-3 px-6">ID</th>
                    <th scope="col" className="py-3 px-6">Employee ID</th>
                    <th scope="col" className="py-3 px-6">Amount</th>
                    <th scope="col" className="py-3 px-6">Reason</th>
                    <th scope="col" className="py-3 px-6">Applied Date</th>
                    <th scope="col" className="py-3 px-6">Status</th>
                    <th scope="col" className="py-3 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trainingRequests.map(request => (
                    <tr key={request.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="py-4 px-6">{request.id}</td>
                      <td className="py-4 px-6">{request.eid}</td>
                      <td className="py-4 px-6">${request.requestedamount}</td>
                      <td className="py-4 px-6">
                        {request.reason?.length > 30 
                          ? `${request.reason.substring(0, 30)}...` 
                          : request.reason}
                      </td>
                      <td className="py-4 px-6">
                        {request.applieddate ? 
                          (() => {
                            try {
                              return new Date(request.applieddate).toLocaleDateString();
                            } catch (e) {
                              console.error(`Error formatting applieddate: ${request.applieddate}`, e);
                              return request.applieddate;
                            }
                          })() : 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        {updatingStatus[request.id] ? (
                          <span className="px-2 py-1 rounded text-xs bg-gray-100">Updating...</span>
                        ) : (
                          <select
                            className={`px-2 py-1 rounded text-xs border ${
                              request.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-300' : 
                              request.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-300' : 
                              'bg-yellow-100 text-yellow-800 border-yellow-300'
                            }`}
                            value={request.status || 'Pending'}
                            onChange={(e) => handleStatusChange(request.id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        )}
                      </td>
                      <td className="py-4 px-6 flex space-x-2">
                        <button
                          onClick={() => handleEditTrainingRequest(request)}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTrainingRequest(request.id)}
                          className="font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Budget Requests Table */}
      {activeTab === 'requests' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Training Budget Requests</h2>
          </div>

          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : budgetRequests.length === 0 ? (
            <p className="text-center py-4">No training budget requests found.</p>
          ) : (
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-white uppercase bg-blue-600">
                  <tr>
                    <th scope="col" className="py-3 px-6">Employee ID</th>
                    <th scope="col" className="py-3 px-6">Requested Amount</th>
                    <th scope="col" className="py-3 px-6">Reason</th>
                    <th scope="col" className="py-3 px-6">Applied Date</th>
                    <th scope="col" className="py-3 px-6">Status</th>
                    <th scope="col" className="py-3 px-6">Granted Date</th>
                    <th scope="col" className="py-3 px-6">Document</th>
                    <th scope="col" className="py-3 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetRequests.map(request => (
                    <tr key={request.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="py-4 px-6">{request.eid}</td>
                      <td className="py-4 px-6">${parseFloat(request.requestedamount).toFixed(2)}</td>
                      <td className="py-4 px-6">{request.reason}</td>
                      <td className="py-4 px-6">
                        {request.applieddate ? new Date(request.applieddate).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          {request.status === 'Approved' && <FaCheckCircle className="text-green-500 mr-1" />}
                          {request.status === 'Rejected' && <FaTimesCircle className="text-red-500 mr-1" />}
                          {request.status === 'Pending' && <FaClock className="text-yellow-500 mr-1" />}
                          <span className={`
                            ${request.status === 'Approved' ? 'text-green-500' : ''}
                            ${request.status === 'Rejected' ? 'text-red-500' : ''}
                            ${request.status === 'Pending' ? 'text-yellow-500' : ''}
                          `}>
                            {request.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {request.granteddate && request.granteddate !== 'null' 
                          ? new Date(request.granteddate).toLocaleDateString() 
                          : '-'}
                      </td>
                      <td className="py-4 px-6">
                        {request.proofdocumenturl ? (
                          <a 
                            href={request.proofdocumenturl} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <FaFileAlt className="mr-1" />
                            View
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-4 px-6 flex items-center space-x-2">
                        {/* Edit button */}
                        <button
                          onClick={() => handleEditBudgetRequest(request)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>

                        {/* Status update buttons - Only show if pending */}
                        {request.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateBudgetRequestStatus(request.id, 'Approved')}
                              className={`text-green-600 hover:text-green-900 ${updatingStatus[request.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={updatingStatus[request.id]}
                              title="Approve"
                            >
                              <FaCheckCircle />
                            </button>
                            <button
                              onClick={() => handleUpdateBudgetRequestStatus(request.id, 'Rejected')}
                              className={`text-red-600 hover:text-red-900 ${updatingStatus[request.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={updatingStatus[request.id]}
                              title="Reject"
                            >
                              <FaTimesCircle />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <Modal 
          sidebarToggle={sidebarToggle} 
          handleIsOpen={handleIsOpen} 
          modelDetails={modelDetails} 
          selectedObject={selectedObject} 
        />
      )}
    </div>
  );
};

export default Training;