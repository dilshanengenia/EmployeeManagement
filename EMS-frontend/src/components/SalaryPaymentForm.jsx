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

const SalaryPaymentForm = ({ buttonName, selectedObject, handleIsOpen }) => {
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    eid: selectedObject?.eid || '',
    salary: selectedObject?.salary || '',
    paiddate: new Date().toISOString().split('T')[0] // Default to today
  });
  // Load salary data for selected employee
  const [verifyingEmployee, setVerifyingEmployee] = useState(false);
  const [employeeExists, setEmployeeExists] = useState(null);
  
  useEffect(() => {
    // Create a debounce timer to avoid too many API calls while typing
    const timeoutId = setTimeout(async () => {
      const fetchSalaryData = async () => {
        if (!formData.eid || formData.eid.trim() === '') {
          setSalaryData(null);
          setEmployeeExists(null);
          return;
        }
        
        setVerifyingEmployee(true);
        try {
          // First check if the employee exists
          try {
            await apiClient.get(`/employees/${formData.eid}/`);
            setEmployeeExists(true);
          } catch (empErr) {
            if (empErr.response && empErr.response.status === 404) {
              setEmployeeExists(false);
              setSalaryData(null);
              setVerifyingEmployee(false);
              return;
            }
          }
          
          // If employee exists, try to get salary data
          try {
            const response = await apiClient.get(`/salary/${formData.eid}/`);
            setSalaryData(response.data);
            
            // Auto-fill the salary amount with the net salary
            setFormData(prev => ({
              ...prev,
              salary: response.data.netsalary
            }));
          } catch (salaryErr) {
            // If no salary record for this employee
            console.error("Error fetching salary data:", salaryErr);
            setSalaryData(null);
            toast.warning("No salary record found for this employee");
          }
        } catch (err) {
          console.error("Error:", err);
        } finally {
          setVerifyingEmployee(false);
        }
      };
      
      if (formData.eid) {
        fetchSalaryData();
      }
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [formData.eid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };  const handleSubmit = async (e) => {
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
        formData.salary === '' || 
        isNaN(formData.salary) || 
        parseFloat(formData.salary) <= 0
      ) {
        toast.error("Please enter a valid salary amount");
        setLoading(false);
        return;
      }

      if (!formData.paiddate) {
        toast.error("Please select a payment date");
        setLoading(false);
        return;
      }      // Check if a payment already exists for this employee on this date
      try {
        const response = await apiClient.get(`/employee_payments/${formData.eid}/`);
        const existingPayment = response.data.find(payment => 
          new Date(payment.paiddate).toISOString().split('T')[0] === formData.paiddate
        );
        
        if (existingPayment) {
          if (!window.confirm('A payment already exists for this employee on this date. Do you want to proceed with recording another payment?')) {
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        // Continue if there's an error checking (likely means no records exist)
      }      // Submit payment record
      await apiClient.post('/salary_payments/', formData);
      toast.success("Salary payment recorded successfully");
      
      // Close the modal and refresh the data
      handleIsOpen();
      // Force a reload to refresh the data in the parent component
      window.location.reload();    } catch (error) {
      console.error("Error recording payment:", error);
      
      let errorMessage = "Error recording payment. Please try again.";
      
      if (error.response) {
        if (error.response.status === 400) {
          // Handle validation errors
          if (error.response.data?.error) {
            errorMessage = error.response.data.error;
          } else if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error.response.status === 404) {
          errorMessage = "Employee or salary record not found.";
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
        <div className="grid gap-4 mb-4 grid-cols-2">          <div className="col-span-2">
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
            <p className="mt-1 text-sm text-gray-500">Enter the employee ID directly to record a salary payment</p>
            {!verifyingEmployee && employeeExists === false && (
              <p className="mt-1 text-sm text-red-500">Employee not found. Please check the ID.</p>
            )}
            {!verifyingEmployee && employeeExists === true && !salaryData && (
              <p className="mt-1 text-sm text-yellow-500">Employee found, but no salary record exists.</p>
            )}
          </div>

          {salaryData && (
            <div className="col-span-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Salary Information:
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Basic Salary: ${salaryData.basicsalary} | Net Salary: ${salaryData.netsalary}
              </p>
            </div>
          )}

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="salary" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Payment Amount
            </label>
            <input
              type="number"
              step="0.01"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="0.00"
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="paiddate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Payment Date
            </label>
            <input
              type="date"
              id="paiddate"
              name="paiddate"
              value={formData.paiddate}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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

export default SalaryPaymentForm;
