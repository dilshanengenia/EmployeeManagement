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

const SalaryForm = ({ buttonName, selectedObject, handleIsOpen }) => {  
  const [loading, setLoading] = useState(false);
  const [verifyingEmployee, setVerifyingEmployee] = useState(false);
  const [employeeExists, setEmployeeExists] = useState(null);
  
  const [formData, setFormData] = useState({
    eid: selectedObject?.eid || '',
    basicsalary: selectedObject?.basicsalary || '',
    internetchages: selectedObject?.internetchages || '',
    allowances: selectedObject?.allowances || '',
    deductions: selectedObject?.deductions || '',
    epf_employee: selectedObject?.epf_employee || '',
    epf_employer: selectedObject?.epf_employer || '',
    etf_employer: selectedObject?.etf_employer || '',
    netsalary: selectedObject?.netsalary || ''
  });
  
  // Check if employee exists when ID is entered
  useEffect(() => {
    if (selectedObject) {
      // If editing an existing record, we know the employee exists
      setEmployeeExists(true);
      return;
    }
    
    const timeoutId = setTimeout(async () => {
      if (!formData.eid || formData.eid.trim() === '') {
        setEmployeeExists(null);
        return;
      }
      
      setVerifyingEmployee(true);
      try {
        await apiClient.get(`/employees/${formData.eid}/`);
        setEmployeeExists(true);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setEmployeeExists(false);
        } else {
          console.error("Error verifying employee:", err);
        }
      } finally {
        setVerifyingEmployee(false);
      }
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [formData.eid, selectedObject]);
  // Calculate EPF, ETF and net salary automatically when components change
  useEffect(() => {
    if (
      formData.basicsalary !== '' && 
      formData.internetchages !== '' && 
      formData.allowances !== '' && 
      formData.deductions !== ''
    ) {
      const basic = parseFloat(formData.basicsalary) || 0;
      const internet = parseFloat(formData.internetchages) || 0;
      const allowances = parseFloat(formData.allowances) || 0;
      const deductions = parseFloat(formData.deductions) || 0;
      
      // When editing, only recalculate if values changed or if it's a new record
      if (!selectedObject || 
          basic !== parseFloat(selectedObject.basicsalary) || 
          internet !== parseFloat(selectedObject.internetchages) || 
          allowances !== parseFloat(selectedObject.allowances) || 
          deductions !== parseFloat(selectedObject.deductions)) {
        
        // Calculate EPF and ETF
        const epfEmployeeRate = 0.08; // 8% 
        const epfEmployerRate = 0.12; // 12%
        const etfEmployerRate = 0.03; // 3%
        
        const epfEmployee = basic * epfEmployeeRate;
        const epfEmployer = basic * epfEmployerRate;
        const etfEmployer = basic * etfEmployerRate;
        
        // Calculate net salary after EPF deduction
        const netSalary = (basic + internet + allowances) - (deductions + epfEmployee);
        
        setFormData(prev => ({
          ...prev,
          epf_employee: epfEmployee.toFixed(2),
          epf_employer: epfEmployer.toFixed(2),
          etf_employer: etfEmployer.toFixed(2),
          netsalary: netSalary.toFixed(2)
        }));
      }
    }
  }, [formData.basicsalary, formData.internetchages, formData.allowances, formData.deductions, selectedObject]);

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

      // Validate employee ID format
      const eidValue = formData.eid.trim();
      if (!/^[a-zA-Z0-9_-]+$/.test(eidValue)) {
        toast.error("Employee ID contains invalid characters");
        setLoading(false);
        return;
      }

      if (
        formData.basicsalary === '' || 
        isNaN(formData.basicsalary) ||
        formData.internetchages === '' || 
        isNaN(formData.internetchages) ||
        formData.allowances === '' || 
        isNaN(formData.allowances) ||
        formData.deductions === '' || 
        isNaN(formData.deductions)
      ) {
        toast.error("Please enter valid numeric values for all salary fields");
        setLoading(false);
        return;
      }
      
      // Make API call based on whether we're adding or editing
      if (selectedObject) {
        // Update existing record
        await apiClient.put(`/salary/${formData.eid}/`, formData);
        toast.success("Salary record updated successfully");
      } else {
        // Add new record
        await apiClient.post('/salary/', formData);
        toast.success("Salary record added successfully");
      }
      
      // Close the modal and refresh the data
      handleIsOpen();
      // Force a reload to refresh the data in the parent component
      window.location.reload();    
    } catch (error) {
      console.error("Error saving salary data:", error);
      
      let errorMessage = "Error saving salary record. Please try again.";
      
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
        } else if (error.response.status === 409) {
          errorMessage = "This employee already has a salary record.";
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
            <div className="relative">
              <input
                type="text"
                id="eid"
                name="eid"
                value={formData.eid}
                onChange={handleChange}
                disabled={selectedObject !== null}
                className={`bg-gray-50 border ${
                  employeeExists === true ? 'border-green-500' :
                  employeeExists === false ? 'border-red-500' :
                  'border-gray-300'
                } text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                placeholder="Enter Employee ID"
                required
              />
              {verifyingEmployee && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
              {!verifyingEmployee && employeeExists === true && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
              )}
              {!verifyingEmployee && employeeExists === false && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                  </svg>
                </div>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">Enter the employee ID directly instead of selecting from a list</p>
            {!verifyingEmployee && employeeExists === false && (
              <p className="mt-1 text-sm text-red-500">Employee not found. Please check the ID.</p>
            )}
            {!verifyingEmployee && employeeExists === true && formData.eid && !selectedObject && (
              <p className="mt-1 text-sm text-green-500">Employee found! You can proceed with creating a salary record.</p>
            )}
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="basicsalary" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Basic Salary
            </label>
            <input
              type="number"
              step="0.01"
              id="basicsalary"
              name="basicsalary"
              value={formData.basicsalary}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="0.00"
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="internetchages" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Internet Charges
            </label>
            <input
              type="number"
              step="0.01"
              id="internetchages"
              name="internetchages"
              value={formData.internetchages}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="0.00"
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="allowances" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Allowances
            </label>
            <input
              type="number"
              step="0.01"
              id="allowances"
              name="allowances"
              value={formData.allowances}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="0.00"
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="deductions" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Deductions
            </label>
            <input
              type="number"
              step="0.01"
              id="deductions"
              name="deductions"
              value={formData.deductions}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="0.00"
              required
            />
          </div>          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="epf_employee" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              EPF Employee (8%)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
              <input
                type="text"
                id="epf_employee"
                name="epf_employee"
                value={formData.epf_employee}
                onChange={handleChange}
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-7 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                readOnly
              />
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="epf_employer" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              EPF Employer (12%)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
              <input
                type="text"
                id="epf_employer"
                name="epf_employer"
                value={formData.epf_employer}
                onChange={handleChange}
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-7 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                readOnly
              />
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="etf_employer" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              ETF Employer (3%)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
              <input
                type="text"
                id="etf_employer"
                name="etf_employer"
                value={formData.etf_employer}
                onChange={handleChange}
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-7 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                readOnly
              />
            </div>
          </div>          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="netsalary" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Net Salary (Calculated)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
              <input
                type="text"
                id="netsalary"
                name="netsalary"
                value={formData.netsalary}
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-7 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            disabled={loading}
            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {loading ? 'Saving...' : buttonName}
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

export default SalaryForm;
