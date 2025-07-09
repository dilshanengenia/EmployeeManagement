import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:8000';

// Create a custom axios instance with error handling
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add response interceptor for global error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK') {
      toast.error('Server connection error. Please check if the backend server is running.');
    }
    return Promise.reject(error);
  }
);

const DeleteForm = ({ objectName, handleIsOpen, objectId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  
  // Helper function to get a user-friendly name for the object
  const getObjectLabel = () => {
    switch(objectName) {
      case 'training_budgets':
        return 'Training Budget';
      case 'training_requests':
        return 'Training Request';
      case 'Salary Record':
        return 'Salary Record';
      case 'Payment Record':
        return 'Payment Record';
      case 'Department':
        return 'Department';
      case 'Bank Account':
        return 'Bank Account';
      default:
        return objectName;
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      let endpoint;
      
      // Choose the correct endpoint based on the object type
      if (objectName === 'Salary Record') {
        endpoint = `${API_BASE_URL}/salary/${objectId}/`;
      } else if (objectName === 'Payment Record') {
        // Parse the composite ID (format: eid_YYYYMMDD)
        const [eid, dateId] = objectId.split('_');
        if (dateId && dateId.length === 8) {
          // Convert YYYYMMDD to YYYY-MM-DD
          const year = dateId.substring(0, 4);
          const month = dateId.substring(4, 6);
          const day = dateId.substring(6, 8);
          const formattedDate = `${year}-${month}-${day}`;
          endpoint = `${API_BASE_URL}/salary_payments/${eid}/${formattedDate}/`;
        } else {
          endpoint = `${API_BASE_URL}/salary_payments/${objectId}/`;
        }
      } else if (objectName === 'Department') {
        endpoint = `${API_BASE_URL}/departments/${objectId}/`;
      } else if (objectName === 'Bank Account') {
        endpoint = `${API_BASE_URL}/bank_accounts/${objectId}/`;
        
        // Log the endpoint to verify it's correct
        console.log(`Attempting to delete bank account with endpoint: ${endpoint}`);
      } else if (objectName === 'training_budgets') {
        // Handle training budget deletion
        const numericEid = parseInt(objectId);
        endpoint = `${API_BASE_URL}/training_budgets/${numericEid}/`;
        console.log(`Attempting to delete training budget with endpoint: ${endpoint}`);
      } else if (objectName === 'training_requests') {
        // Handle training request deletion
        endpoint = `${API_BASE_URL}/training_requests/${objectId}/`;
        console.log(`Attempting to delete training request with endpoint: ${endpoint}`);
      } else if (objectName === 'Leave Type') {
        // Handle leave type deletion
        endpoint = `${API_BASE_URL}/leave_types/${objectId}/`;
        console.log(`Attempting to delete leave type with endpoint: ${endpoint}`);
      } else if (objectName === 'Leave Balance') {
        // Handle leave balance deletion
        endpoint = `${API_BASE_URL}/employee_leave_balances/${objectId}/`;
        console.log(`Attempting to delete leave balance with endpoint: ${endpoint}`);
      } else if (objectName === 'Leave Application') {
        // Handle leave application deletion
        endpoint = `${API_BASE_URL}/leave_applications/${objectId}/`;
        console.log(`Attempting to delete leave application with endpoint: ${endpoint}`);
      } else {
        throw new Error(`Unknown object type: ${objectName}`);
      }
      
      // Log the request to aid debugging
      console.log(`Sending DELETE request to ${endpoint}`);
      
      const response = await apiClient.delete(endpoint);
      console.log(`Delete request successful:`, response);
      
      // Format the success message based on object type
      const successMessage = `${getObjectLabel()} deleted successfully`;
      
      toast.success(successMessage);
      
      // Call onSuccess callback if provided, otherwise reload page
      if (onSuccess) {
        onSuccess();
      } else {
        // Force page reload to refresh data (fallback for backwards compatibility)
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
      
      handleIsOpen();
    } catch (error) {
      console.error(`Error deleting ${objectName}:`, error);
      let errorMessage = 'Please try again.';
      let objectLabel = getObjectLabel();
      
      if (error.response) {
        console.error(`Error response:`, error.response);
        if (error.response.status === 404) {
          errorMessage = `${objectLabel} not found. It may have been already deleted.`;
        } else if (error.response.status === 500) {
          errorMessage = `Server error occurred. Please check server logs.`;
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = `No response received from server. Please check your connection.`;
      } else {
        // Something else caused the error
        errorMessage = error.message || 'An unknown error occurred.';
      }
      
      toast.error(`Failed to delete ${objectLabel}. ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (      
      <div className="p-4 md:p-5 text-center">
          <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
          </svg>
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{`Are you sure you want to delete this ${getObjectLabel()} with ID ${objectId}?`}</h3>
          <button 
            onClick={handleDelete}
            disabled={loading}
            type="button" 
            className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
          >
              {loading ? 'Deleting...' : 'Yes, I\'m sure'}
          </button>
          <button 
            onClick={handleIsOpen} 
            disabled={loading}
            type="button" 
            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            No, cancel
          </button>
      </div>
  );
}

export default DeleteForm