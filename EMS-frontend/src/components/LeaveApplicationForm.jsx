import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../services/apiClient';

const LeaveApplicationForm = ({ buttonName, selectedObject, handleIsOpen }) => {
  const [loading, setLoading] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState([]);  const [formData, setFormData] = useState({
    eid: selectedObject?.eid || '',
    fromdate: selectedObject?.fromdate || '',
    todate: selectedObject?.todate || '',
    noofdays: selectedObject?.noofdays || '',
    description: selectedObject?.description || '',
    status: selectedObject?.status || 'Pending',
    priority: selectedObject?.priority || 'Medium'
  });

  // Fetch leave types on component mount
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const response = await apiClient.get('/leave_types/');
        setLeaveTypes(response.data);
      } catch (error) {
        console.error('Error fetching leave types:', error);
        toast.error('Failed to load leave types');
      }
    };
    fetchLeaveTypes();
  }, []);

  // Calculate number of days when from and to dates change
  useEffect(() => {
    if (formData.fromdate && formData.todate) {
      const fromDate = new Date(formData.fromdate);
      const toDate = new Date(formData.todate);
      const timeDiff = toDate.getTime() - fromDate.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end date
      
      if (dayDiff > 0) {
        setFormData(prev => ({ ...prev, noofdays: dayDiff }));
      }
    }
  }, [formData.fromdate, formData.todate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Form validation
      if (!formData.eid || formData.eid.trim() === '') {
        toast.error("Please enter an employee ID");
        setLoading(false);
        return;
      }      if (!formData.fromdate || !formData.todate) {
        toast.error("Please select from and to dates");
        setLoading(false);
        return;
      }

      if (new Date(formData.fromdate) > new Date(formData.todate)) {
        toast.error("From date cannot be later than to date");
        setLoading(false);
        return;
      }

      if (!formData.description || formData.description.trim() === '') {
        toast.error("Please enter a description");
        setLoading(false);
        return;
      }

      // Submit leave application
      console.log("Submitting form data:", formData); // Debug log
      await apiClient.post('/leave_applications/', formData);
      toast.success("Leave application submitted successfully");
      
      // Close the modal and refresh the data
      handleIsOpen();
      window.location.reload();
    } catch (error) {
      console.error("Error saving leave application:", error);
      
      let errorMessage = "Error saving leave application. Please try again.";
      
      if (error.response) {
        if (error.response.status === 400) {
          if (error.response.data?.error) {
            errorMessage = error.response.data.error;
          } else if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error.response.status === 404) {
          errorMessage = "Employee not found.";
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative p-4 w-full max-w-2xl max-h-full">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 mb-4 grid-cols-2">
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="eid" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Employee ID
            </label>
            <input
              type="text"
              id="eid"
              name="eid"
              value={formData.eid}
              onChange={handleChange}
              className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              readOnly
              required
            />
          </div>          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="fromdate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              From Date
            </label>
            <input
              type="date"
              id="fromdate"
              name="fromdate"
              value={formData.fromdate}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="todate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              To Date
            </label>
            <input
              type="date"
              id="todate"
              name="todate"
              value={formData.todate}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="noofdays" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Number of Days
            </label>
            <input
              type="number"
              id="noofdays"
              name="noofdays"
              value={formData.noofdays}
              onChange={handleChange}
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              readOnly
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="priority" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Status
            </label>
            <input
              type="text"
              id="status"
              name="status"
              value="Pending"
              className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              readOnly
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Enter leave description/reason"
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

export default LeaveApplicationForm;
