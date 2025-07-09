import React, { useState } from 'react'
import apiClient from '../services/apiClient';

const AddDepartmentForm = ({buttonName, selectedObject, onSuccess}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const departmentData = {
      dno: formData.get('dno'),
      dname: formData.get('dname'),
      noofemp: parseInt(formData.get('noofemp')),
      dlocation: formData.get('dlocation')
    };

    try {
      if (buttonName === 'Add') {
        await apiClient.post('/departments/', departmentData);
      } else if (buttonName === 'Edit') {
        await apiClient.put(`/departments/${selectedObject.dno}/`, departmentData);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while saving the department');
      console.error('Error saving department:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="dno" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Department Number</label>
                        <input 
                          type="text" 
                          name="dno" 
                          defaultValue={selectedObject.dno} 
                          id="dno" 
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                          placeholder="Department number (3 digits)" 
                          maxLength="3"
                          pattern="[0-9]{3}"
                          title="Please enter a 3-digit department number"
                          required 
                          disabled={buttonName === 'Edit'}
                        />
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="dname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Department Name</label>
                        <input 
                          type="text" 
                          name="dname"  
                          defaultValue={selectedObject.dname} 
                          id="dname" 
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                          placeholder="Department name" 
                          required 
                        />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="noofemp" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">No of Employees</label>
                        <input 
                          type="number" 
                          name="noofemp" 
                          id="noofemp"  
                          defaultValue={selectedObject.noofemp} 
                          min='0' 
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                          placeholder="0" 
                          required 
                        />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="dlocation" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
                        <select 
                          id="dlocation" 
                          name="dlocation" 
                          defaultValue={selectedObject.dlocation} 
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          required
                        >
                            <option value="">--Select location--</option>
                            <option value="Australia">Australia</option>
                            <option value="Sri Lanka">Sri Lanka</option>
                            <option value="Pakistan">Pakistan</option>
                            <option value="India">India</option>
                        </select>
                    </div>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Saving...' : buttonName}
                </button>
                <button 
                  type="reset" 
                  className="ml-2 text-white inline-flex items-center bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                >
                    Clear
                </button>
                
            </form>
    </div>
  )
}

export default AddDepartmentForm