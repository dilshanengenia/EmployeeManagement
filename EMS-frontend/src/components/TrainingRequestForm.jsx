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

const TrainingRequestForm = ({ buttonName, selectedObject, handleIsOpen }) => {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    id: selectedObject?.id || '',
    eid: selectedObject?.eid || '',
    requestedamount: selectedObject?.requestedamount || '',
    reason: selectedObject?.reason || '',
    applieddate: selectedObject?.applieddate ? new Date(selectedObject.applieddate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    status: selectedObject?.status || 'Pending',
    granteddate: selectedObject?.granteddate ? new Date(selectedObject.granteddate).toISOString().split('T')[0] : '',
    proofdocumenturl: selectedObject?.proofdocumenturl || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Form validation
      if (!formData.eid) {
        toast.error("Please enter employee ID");
        setLoading(false);
        return;
      }

      if (!formData.requestedamount) {
        toast.error("Please enter requested amount");
        setLoading(false);
        return;
      }

      if (!formData.reason) {
        toast.error("Please enter reason for request");
        setLoading(false);
        return;
      }

      const dataToSend = {
        ...formData,
        // Don't send empty string for granteddate
        granteddate: formData.granteddate || null
      };

      // Determine if we're updating or creating
      if (selectedObject) {
        // Update existing training request
        await apiClient.put(`/training_requests/${formData.id}/`, dataToSend);
        toast.success("Training request updated successfully");
      } else {
        // Create new training request
        const { id, ...newRequest } = dataToSend;  // Remove id for new requests
        await apiClient.post('/training_requests/', newRequest);
        toast.success("Training request added successfully");
      }
      
      // Close the modal and refresh the data
      handleIsOpen();
      // Force a reload to refresh the data in the parent component
      window.location.reload();
    } catch (error) {
      console.error("Error saving training request:", error);
      
      let errorMessage = "Error saving training request. Please try again.";
      
      if (error.response) {
        if (error.response.status === 400) {
          // Handle validation errors
          if (error.response.data?.error) {
            errorMessage = error.response.data.error;
          } else if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error.response.status === 404) {
          errorMessage = "Request not found.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error.request) {
        // Network error
        errorMessage = "Network error. Please check your connection.";
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="p-4 md:p-5">
        <div className="grid gap-4 mb-4 grid-cols-2">
          <div className="col-span-2">
            <label htmlFor="eid" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Employee ID
            </label>
            <input
              type="number"
              id="eid"
              name="eid"
              value={formData.eid}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Enter employee ID"
              required
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="requestedamount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Requested Amount
            </label>
            <input
              type="number"
              step="0.01"
              id="requestedamount"
              name="requestedamount"
              value={formData.requestedamount}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Enter requested amount"
              required
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="reason" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Reason
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Enter reason for request"
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="applieddate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Applied Date
            </label>
            <input
              type="date"
              id="applieddate"
              name="applieddate"
              value={formData.applieddate}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="granteddate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Granted Date (if approved)
            </label>
            <input
              type="date"
              id="granteddate"
              name="granteddate"
              value={formData.granteddate}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="proofdocumenturl" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Proof Document URL
            </label>
            <input
              type="text"
              id="proofdocumenturl"
              name="proofdocumenturl"
              value={formData.proofdocumenturl}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Enter document URL"
            />
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            disabled={loading}
            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {loading ? 'Processing...' : buttonName}
          </button>
          <button
            type="button"
            onClick={handleIsOpen}
            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrainingRequestForm;
