import React, { useState, useEffect } from 'react';
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

const TrainingBudgetForm = ({ buttonName, selectedObject, handleIsOpen }) => {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    eid: selectedObject?.eid || '',
    trainingbudgetrate: selectedObject?.trainingbudgetrate || '',
    trainingbudgetamount: selectedObject?.trainingbudgetamount || '',
    remainingamount: selectedObject?.remainingamount || ''
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

      if (!formData.trainingbudgetrate) {
        toast.error("Please enter training budget rate");
        setLoading(false);
        return;
      }

      if (!formData.trainingbudgetamount) {
        toast.error("Please enter training budget amount");
        setLoading(false);
        return;
      }

      if (!formData.remainingamount) {
        toast.error("Please enter remaining amount");
        setLoading(false);
        return;
      }

      // Determine if we're updating or creating
      if (selectedObject) {
        // Update existing training budget
        await apiClient.put(`/training_budgets/${formData.eid}/`, formData);
        toast.success("Training budget updated successfully");
      } else {
        // Create new training budget
        await apiClient.post('/training_budgets/', formData);
        toast.success("Training budget added successfully");
      }
      
      // Close the modal and refresh the data
      handleIsOpen();
      // Force a reload to refresh the data in the parent component
      window.location.reload();
    } catch (error) {
      console.error("Error saving training budget:", error);
      
      let errorMessage = "Error saving training budget. Please try again.";
      
      if (error.response) {
        if (error.response.status === 400) {
          // Handle validation errors
          if (error.response.data?.error) {
            errorMessage = error.response.data.error;
          } else if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error.response.status === 404) {
          errorMessage = "Employee not found.";
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
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${selectedObject ? 'bg-gray-100' : ''}`}
              placeholder="Enter employee ID"
              disabled={selectedObject !== null}
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="trainingbudgetrate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Training Budget Rate (%)
            </label>
            <input
              type="number"
              step="0.01"
              id="trainingbudgetrate"
              name="trainingbudgetrate"
              value={formData.trainingbudgetrate}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Enter budget rate"
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="trainingbudgetamount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Training Budget Amount
            </label>
            <input
              type="number"
              step="0.01"
              id="trainingbudgetamount"
              name="trainingbudgetamount"
              value={formData.trainingbudgetamount}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Enter budget amount"
              required
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="remainingamount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Remaining Amount
            </label>
            <input
              type="number"
              step="0.01"
              id="remainingamount"
              name="remainingamount"
              value={formData.remainingamount}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Enter remaining amount"
              required
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

export default TrainingBudgetForm;
