import React, { useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../services/apiClient';

const LeaveTypeForm = ({ buttonName, selectedObject, handleIsOpen }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    lid: selectedObject?.lid || '',
    leavetype: selectedObject?.leavetype || ''
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
      if (!formData.lid || formData.lid.trim() === '') {
        toast.error("Please enter a leave ID");
        setLoading(false);
        return;
      }

      if (!formData.leavetype || formData.leavetype.trim() === '') {
        toast.error("Please enter a leave type");
        setLoading(false);
        return;
      }

      // Make API call based on whether we're adding or editing
      if (selectedObject) {
        // Update existing leave type
        await apiClient.put(`/leave_types/${formData.lid}/`, formData);
        toast.success("Leave type updated successfully");
      } else {
        // Add new leave type
        await apiClient.post('/leave_types/', formData);
        toast.success("Leave type added successfully");
      }
      
      // Close the modal and refresh the data
      handleIsOpen();
      window.location.reload();
    } catch (error) {
      console.error("Error saving leave type:", error);
      
      let errorMessage = "Error saving leave type. Please try again.";
      
      if (error.response) {
        if (error.response.status === 400) {
          if (error.response.data?.error) {
            errorMessage = error.response.data.error;
          } else if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error.response.status === 409) {
          errorMessage = "This leave type ID already exists.";
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative p-4 w-full max-w-md max-h-full">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 mb-4 grid-cols-1">
          <div>
            <label htmlFor="lid" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Leave ID
            </label>
            <input
              type="text"
              id="lid"
              name="lid"
              value={formData.lid}
              onChange={handleChange}
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${selectedObject ? 'bg-gray-100' : ''}`}
              placeholder="Enter leave ID (e.g., L001)"
              disabled={selectedObject !== null}
              required
            />
          </div>

          <div>
            <label htmlFor="leavetype" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Leave Type
            </label>
            <input
              type="text"
              id="leavetype"
              name="leavetype"
              value={formData.leavetype}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Enter leave type (e.g., Annual, Casual)"
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

export default LeaveTypeForm;
