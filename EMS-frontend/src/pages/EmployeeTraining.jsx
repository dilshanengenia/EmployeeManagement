import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaUser, FaMoneyBillWave, FaCheckCircle, FaClock, FaBan, FaPlus } from 'react-icons/fa';
import apiClient from '../services/apiClient';
import { toast } from 'react-toastify';

const EmployeeTraining = () => {
  const { sidebarToggle } = useOutletContext();
  const [trainingBudget, setTrainingBudget] = useState(null);
  const [budgetRequests, setBudgetRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({
    requestedAmount: '',
    reason: '',
    proofDocumentUrl: ''
  });

  const userId = localStorage.getItem('userId');useEffect(() => {
    if (userId) {
      fetchTrainingBudget();
      fetchBudgetRequests();
    }
  }, [userId]);

  const fetchTrainingBudget = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/training_budgets/${userId}/`);
      setTrainingBudget(response.data);
    } catch (error) {
      console.error('Error fetching training budget:', error);
      setError('Failed to fetch training budget information');
      if (error.response?.status !== 404) {
        toast.error("Failed to load training budget information");
      }
    } finally {
      setLoading(false);
    }
  };  const fetchBudgetRequests = async () => {
    try {
      const response = await apiClient.get(`/training_requests/`);
      // Filter requests for the specific employee (handle both string and number comparison)
      const userRequests = response.data.filter(request => 
        request.eid == userId || request.eid === parseInt(userId)
      );
      setBudgetRequests(userRequests);
    } catch (error) {
      console.error('Error fetching budget requests:', error);
      toast.error("Failed to load budget request information");
    }
  };

  const handleRequestFormChange = (e) => {
    const { name, value } = e.target;
    setRequestForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!userId) {
        toast.error("User ID not found");
        setLoading(false);
        return;
      }

      if (!requestForm.requestedAmount || parseFloat(requestForm.requestedAmount) <= 0) {
        toast.error("Please enter a valid amount");
        setLoading(false);
        return;
      }

      if (!requestForm.reason.trim()) {
        toast.error("Please enter a reason for your request");
        setLoading(false);
        return;
      }

      const today = new Date().toISOString().split('T')[0];

      const dataToSend = {
        eid: userId,
        requestedamount: parseFloat(requestForm.requestedAmount),
        reason: requestForm.reason,
        applieddate: today,
        status: 'Pending',
        proofdocumenturl: requestForm.proofDocumentUrl || null
      };      await apiClient.post('/training_requests/', dataToSend);
      toast.success("Training budget request submitted successfully");

      // Reset form and refresh data
      setRequestForm({
        requestedAmount: '',
        reason: '',
        proofDocumentUrl: ''
      });
      setShowRequestForm(false);
      fetchBudgetRequests();
    } catch (error) {
      console.error("Error submitting budget request:", error);
      toast.error("Failed to submit budget request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <FaCheckCircle className="text-green-500" />;
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'rejected':
        return <FaBan className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };  return (
    <div className={`${sidebarToggle ? "ml-20" : "ml-64"} p-6`}>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-black mt-4 mb-6 text-center border-b pb-2">
        Training Budget Management
      </h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-600 dark:text-gray-400">Loading training budget information...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
              <FaUser className="mr-2" />
              My Training Budget Allocation
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Employee ID: {userId}
            </p>
          </div>

          <div className="p-6">
            {trainingBudget ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-6 py-3">Budget Amount</th>
                      <th className="px-6 py-3">Budget Rate (%)</th>
                      <th className="px-6 py-3">Remaining Amount</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        ${parseFloat(trainingBudget.trainingbudgetamount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {parseFloat(trainingBudget.trainingbudgetrate).toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 font-medium text-green-600">
                        ${parseFloat(trainingBudget.remainingamount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          parseFloat(trainingBudget.remainingamount) > 0 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {parseFloat(trainingBudget.remainingamount) > 0 ? 'Budget Available' : 'Budget Exhausted'}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No training budget allocation found for your account.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Budget Request Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Budget Requests</h2>
          <button
            onClick={() => setShowRequestForm(!showRequestForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2"
          >
            <FaPlus />
            <span>New Request</span>
          </button>
        </div>

        {/* Request Form */}
        {showRequestForm && (
          <div className="border-b border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Submit Budget Request
            </h3>
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Requested Amount ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="requestedAmount"
                    value={requestForm.requestedAmount}
                    onChange={handleRequestFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Proof Document URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="proofDocumentUrl"
                    value={requestForm.proofDocumentUrl}
                    onChange={handleRequestFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    placeholder="https://example.com/document.pdf"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for Request *
                </label>
                <textarea
                  name="reason"
                  value={requestForm.reason}
                  onChange={handleRequestFormChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  placeholder="Explain why you need this budget allocation..."
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                >
                  <FaMoneyBillWave />
                  <span>{loading ? 'Submitting...' : 'Submit Request'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Budget Requests Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Requested Amount</th>
                  <th className="px-6 py-3">Reason</th>
                  <th className="px-6 py-3">Applied Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Granted Date</th>
                  <th className="px-6 py-3">Document</th>
                </tr>
              </thead>
              <tbody>
                {budgetRequests.length > 0 ? (
                  budgetRequests.map((request, index) => (
                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        ${parseFloat(request.requestedamount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="truncate" title={request.reason}>
                          {request.reason || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {request.applieddate ? new Date(request.applieddate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(request.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {request.granteddate ? new Date(request.granteddate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4">
                        {request.proofdocumenturl ? (
                          <a 
                            href={request.proofdocumenturl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center space-x-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <span>View</span>
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No budget requests found. Click "New Request" to submit your first request.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTraining;
