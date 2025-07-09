import React, { useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../services/apiClient';

const LeaveStatusUpdateForm = ({ selectedObject, handleIsOpen }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(selectedObject?.status || 'Pending');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Use the lid (Leave ID) directly since it's the primary key
      const applicationId = selectedObject.lid;
      
      console.log("Updating leave application:", applicationId); // Debug log
      console.log("Selected object:", selectedObject); // Debug log
      
      // Update only the status field
      await apiClient.put(`/leave_applications/${applicationId}/`, {
        ...selectedObject,
        status: status
      });
      
      toast.success("Leave application status updated successfully");
      handleIsOpen();
      window.location.reload(); // Refresh to see changes
    } catch (error) {
      console.error("Error updating leave status:", error);
      
      let errorMessage = "Error updating leave status. Please try again.";
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data?.error || error.response.data?.message || errorMessage;
        } else if (error.response.status === 404) {
          errorMessage = "Leave application not found.";
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative p-4 w-full max-w-md max-h-full">
      <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div className="grid gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Leave Application Details
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Employee ID:</p>
                    <p className="font-medium">{selectedObject?.eid}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Leave Type:</p>
                    <p className="font-medium">{selectedObject?.lid}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">From Date:</p>
                    <p className="font-medium">{selectedObject?.fromdate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">To Date:</p>
                    <p className="font-medium">{selectedObject?.todate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Days:</p>
                    <p className="font-medium">{selectedObject?.noofdays}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Priority:</p>
                    <p className="font-medium">{selectedObject?.priority}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-300">Description:</p>
                  <p className="font-medium">{selectedObject?.description}</p>
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Update Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              type="submit"
              disabled={loading}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {loading ? 'Updating...' : 'Update Status'}
            </button>
            <button
              type="button"
              onClick={handleIsOpen}
              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveStatusUpdateForm;
