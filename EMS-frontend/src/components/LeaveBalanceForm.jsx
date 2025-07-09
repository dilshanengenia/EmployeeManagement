import React, { useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../services/apiClient';

const LeaveBalanceForm = ({ buttonName, selectedObject, handleIsOpen }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eid: selectedObject?.eid || '',
    totalannualleaves: selectedObject?.totalannualleaves || 14,
    totalcasualleaves: selectedObject?.totalcasualleaves || 7,
    annualleavebalance: selectedObject?.annualleavebalance || 14,
    casualleavebalance: selectedObject?.casualleavebalance || 7
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
      if (!formData.eid || formData.eid.trim() === '') {
        toast.error("Please enter an employee ID");
        setLoading(false);
        return;
      }

      if (parseInt(formData.annualleavebalance) > parseInt(formData.totalannualleaves)) {
        toast.error("Annual leave balance cannot exceed total annual leaves");
        setLoading(false);
        return;
      }

      if (parseInt(formData.casualleavebalance) > parseInt(formData.totalcasualleaves)) {
        toast.error("Casual leave balance cannot exceed total casual leaves");
        setLoading(false);
        return;
      }

      // Make API call based on whether we're adding or editing
      if (selectedObject) {
        // Update existing balance
        await apiClient.put(`/employee_leave_balances/${formData.eid}/`, formData);
        toast.success("Leave balance updated successfully");
      } else {
        // Add new balance
        await apiClient.post('/employee_leave_balances/', formData);
        toast.success("Leave balance added successfully");
      }
      
      // Close the modal and refresh the data
      handleIsOpen();
      window.location.reload();
    } catch (error) {
      console.error("Error saving leave balance:", error);
      
      let errorMessage = "Error saving leave balance. Please try again.";
      
      if (error.response) {
        if (error.response.status === 400) {
          if (error.response.data?.error) {
            errorMessage = error.response.data.error;
          } else if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error.response.status === 404) {
          errorMessage = "Employee not found.";
        } else if (error.response.status === 409) {
          errorMessage = "This employee already has a leave balance record.";
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
        <div className="grid gap-4 mb-4 grid-cols-2">
          <div className="col-span-2">
            <label htmlFor="eid" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Employee ID
            </label>
            <input
              type="text"
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
            <label htmlFor="totalannualleaves" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Total Annual Leaves
            </label>
            <input
              type="number"
              id="totalannualleaves"
              name="totalannualleaves"
              value={formData.totalannualleaves}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              min="0"
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="totalcasualleaves" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Total Casual Leaves
            </label>
            <input
              type="number"
              id="totalcasualleaves"
              name="totalcasualleaves"
              value={formData.totalcasualleaves}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              min="0"
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="annualleavebalance" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Annual Leave Balance
            </label>
            <input
              type="number"
              id="annualleavebalance"
              name="annualleavebalance"
              value={formData.annualleavebalance}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              min="0"
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="casualleavebalance" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Casual Leave Balance
            </label>
            <input
              type="number"
              id="casualleavebalance"
              name="casualleavebalance"
              value={formData.casualleavebalance}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              min="0"
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

export default LeaveBalanceForm;
