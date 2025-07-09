import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import axios from 'axios';
import EmployeeSalaryDetails from '../components/EmployeeSalaryDetails';

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

const Salary = () => {
  const { sidebarToggle } = useOutletContext();
  const [activeTab, setActiveTab] = useState('salaryManagement');
  const [salaryData, setSalaryData] = useState([]);
  const [salaryPayments, setSalaryPayments] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalDetails, setModalDetails] = useState({
    title: "",
    component: "",
    buttonName: "",
    objectName: ""
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState({
    startDate: '',
    endDate: ''
  });

  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  }

  // Fetch salary data from API
  useEffect(() => {
    const fetchSalaryData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/salary/');
        setSalaryData(response.data);
      } catch (err) {
        console.error('Error fetching salary data:', err);
        setError('Failed to load salary data. Please try again later.');
        toast.error('Failed to load salary data');
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'salaryManagement') {
      fetchSalaryData();
    }
  }, [activeTab]);

  // Fetch salary payments data from API
  useEffect(() => {
    const fetchSalaryPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/salary_payments/');
        if (Array.isArray(response.data)) {
          // Sort by employee ID (eid) in ascending order
          const sortedData = [...response.data].sort((a, b) => {
            // Convert both values to strings to ensure they can be compared safely
            const eidA = String(a.eid || '');
            const eidB = String(b.eid || '');
            return eidA.localeCompare(eidB);
          });
          setSalaryPayments(sortedData);
        } else {
          console.error('Unexpected response format:', response.data);
          setSalaryPayments([]);
          setError('Received unexpected data format from server');
          toast.error('Data format error. Please contact support.');
        }
      } catch (err) {
        console.error('Error fetching salary payments:', err);
        
        let errorMessage = 'Failed to load salary payments. Please try again later.';
        
        if (err.response && err.response.data && err.response.data.error) {
          // If the server sent a specific error message
          errorMessage = `Error: ${err.response.data.error}`;
        } else if (err.code === 'ERR_NETWORK') {
          errorMessage = 'Network error. Please check if the server is running.';
        } else if (err.response && err.response.status === 500) {
          errorMessage = 'Server error. The administrator has been notified.';
        }
        
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'paymentHistory') {
      fetchSalaryPayments();
    }
  }, [activeTab]);

  // Fetch bank account details from API
  useEffect(() => {
    const fetchBankAccounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/bank_accounts/');
        if (Array.isArray(response.data)) {
          // Sort by employee ID (eid) in ascending order
          const sortedData = [...response.data].sort((a, b) => {
            // Convert both values to strings to ensure they can be compared safely
            const eidA = String(a.eid || '');
            const eidB = String(b.eid || '');
            return eidA.localeCompare(eidB);
          });
          setBankAccounts(sortedData);
        } else {
          console.error('Unexpected response format:', response.data);
          setBankAccounts([]);
          setError('Received unexpected data format from server');
          toast.error('Data format error. Please contact support.');
        }
      } catch (err) {
        console.error('Error fetching bank accounts:', err);
        
        let errorMessage = 'Failed to load bank account details. Please try again later.';
        
        if (err.response && err.response.data && err.response.data.error) {
          // If the server sent a specific error message
          errorMessage = `Error: ${err.response.data.error}`;
        } else if (err.code === 'ERR_NETWORK') {
          errorMessage = 'Network error. Please check if the server is running.';
        } else if (err.response && err.response.status === 500) {
          errorMessage = 'Server error. The administrator has been notified.';
        }
        
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'bankAccounts') {
      fetchBankAccounts();
    }
  }, [activeTab]);

  // Handle add new salary record
  const handleAddSalary = () => {
    setSelectedEmployee(null);
    setModalDetails({
      title: "Add New Salary Record",
      component: "SalaryForm",
      buttonName: "Add"
    });
    handleIsOpen();
  };

  // Handle edit salary record
  const handleEditSalary = (salary) => {
    setSelectedEmployee(salary);
    setModalDetails({
      title: "Edit Salary Record",
      component: "SalaryForm",
      buttonName: "Save"
    });
    handleIsOpen();
  };

  // Handle delete salary record
  const handleDeleteSalary = (salary) => {
    setSelectedEmployee(salary);
    setModalDetails({
      title: "Delete Salary Record",
      component: "DeleteForm",
      objectName: "Salary Record",
      objectId: salary.eid
    });
    handleIsOpen();
  };

  // Handle add new payment
  const handleAddPayment = () => {
    setSelectedEmployee(null);
    setModalDetails({
      title: "Record New Salary Payment",
      component: "SalaryPaymentForm",
      buttonName: "Add"
    });
    handleIsOpen();
  };
  
  // Handle delete payment record
  const handleDeletePayment = (payment) => {
    setSelectedEmployee(payment);
    setModalDetails({
      title: "Delete Payment Record",
      component: "DeleteForm",
      objectName: "Payment Record",
      objectId: payment.id
    });
    handleIsOpen();
  };

  // Handle add new bank account
  const handleAddBankAccount = () => {
    setSelectedEmployee(null);
    setModalDetails({
      title: "Add Bank Account Details",
      component: "BankAccountForm",
      buttonName: "Add"
    });
    handleIsOpen();
  };

  // Handle edit bank account
  const handleEditBankAccount = (account) => {
    setSelectedEmployee(account);
    setModalDetails({
      title: "Edit Bank Account Details",
      component: "BankAccountForm",
      buttonName: "Save"
    });
    handleIsOpen();
  };

  // Handle delete bank account
  const handleDeleteBankAccount = (account) => {
    setSelectedEmployee(account);
    setModalDetails({
      title: "Delete Bank Account Details",
      component: "DeleteForm",
      objectName: "Bank Account",
      objectId: account.eid
    });
    handleIsOpen();
  };

  // Filter data based on search term
  const filteredSalaryData = searchTerm === "" ? salaryData : salaryData.filter(salary =>
    String(salary.eid).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayments = salaryPayments.filter(payment => {
    // Apply employee ID filter
    const matchesSearchTerm = searchTerm === "" || 
      String(payment.eid).toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply specific date filter if present
    let matchesDateFilter = true;
    if (dateFilter !== "") {
      matchesDateFilter = new Date(payment.paiddate).toISOString().split('T')[0] === dateFilter;
    }
    
    // Apply date range filter if present
    let matchesDateRangeFilter = true;
    if (dateRangeFilter.startDate || dateRangeFilter.endDate) {
      const paymentDate = new Date(payment.paiddate);
      
      if (dateRangeFilter.startDate) {
        const startDate = new Date(dateRangeFilter.startDate);
        if (paymentDate < startDate) {
          matchesDateRangeFilter = false;
        }
      }
      
      if (dateRangeFilter.endDate) {
        const endDate = new Date(dateRangeFilter.endDate);
        endDate.setHours(23, 59, 59); // Set to end of day
        if (paymentDate > endDate) {
          matchesDateRangeFilter = false;
        }
      }
    }
    
    return matchesSearchTerm && matchesDateFilter && matchesDateRangeFilter;
  });

  const filteredBankAccounts = bankAccounts.filter(account => 
    String(account.eid).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${sidebarToggle ? "ml-20": " ml-64 "}`}>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-8 mb-6 text-center border-b pb-2">
        Salary Management
      </h1>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="mr-2">
            <button 
              onClick={() => setActiveTab('salaryManagement')}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                activeTab === 'salaryManagement' 
                  ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500' 
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
              Salary Management
            </button>
          </li>
          <li className="mr-2">
            <button 
              onClick={() => setActiveTab('paymentHistory')}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                activeTab === 'paymentHistory' 
                  ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500' 
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
              </svg>
              Payment History
            </button>
          </li>
          <li className="mr-2">
            <button 
              onClick={() => setActiveTab('bankAccounts')}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                activeTab === 'bankAccounts' 
                  ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500' 
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"></path>
              </svg>
              Bank Accounts
            </button>
          </li>
          <li className="mr-2">
            <button 
              onClick={() => setActiveTab('employeeSalaryDetails')}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                activeTab === 'employeeSalaryDetails' 
                  ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500' 
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
              </svg>
              Employee Salary Details
            </button>
          </li>

        </ul>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {/* Salary Management Tab */}
        {activeTab === 'salaryManagement' && (
          <div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-3">
              <div className="pb-4 bg-white dark:bg-gray-900 pt-3">
                <label htmlFor="table-search" className="sr-only">Search</label>
                <div className="relative flex items-center mt-2 ml-4">  
                  <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    id="table-search" 
                    className="block pt-2 pb-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for employee ID"
                  />
                  <button 
                    onClick={handleAddSalary} 
                    className="ml-auto mr-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    Add Salary Record
                  </button>
                </div>
              </div>
              {loading ? (
                <div className="text-center py-4">Loading salary data...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">Employee ID</th>
                        <th scope="col" className="px-6 py-3">Basic Salary</th>
                        <th scope="col" className="px-6 py-3">Internet Charges</th>
                        <th scope="col" className="px-6 py-3">Allowances</th>
                        <th scope="col" className="px-6 py-3">Deductions</th>
                        <th scope="col" className="px-6 py-3">EPF Employee</th>
                        <th scope="col" className="px-6 py-3">EPF Employer</th>
                        <th scope="col" className="px-6 py-3">ETF Employer</th>
                        <th scope="col" className="px-6 py-3">Net Salary</th>
                        <th scope="col" className="px-6 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSalaryData.length > 0 ? (
                        filteredSalaryData.map((salary) => (
                          <tr key={salary.eid} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-6 py-4">{salary.eid}</td>
                            <td className="px-6 py-4">${salary.basicsalary}</td>
                            <td className="px-6 py-4">${salary.internetchages}</td>
                            <td className="px-6 py-4">${salary.allowances}</td>
                            <td className="px-6 py-4">${salary.deductions}</td>
                            <td className="px-6 py-4">${salary.epf_employee}</td>
                            <td className="px-6 py-4">${salary.epf_employer}</td>
                            <td className="px-6 py-4">${salary.etf_employer}</td>
                            <td className="px-6 py-4 font-medium">${salary.netsalary}</td>
                            <td className="px-6 py-4 flex space-x-2">
                              <button 
                                onClick={() => handleEditSalary(salary)} 
                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteSalary(salary)} 
                                className="font-medium text-red-600 dark:text-red-500 hover:underline"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="11" className="px-6 py-4 text-center">No salary records found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment History Tab */}
        {activeTab === 'paymentHistory' && (
          <div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-3">
              <div className="pb-4 bg-white dark:bg-gray-900 pt-3">
                <label htmlFor="payment-search" className="sr-only">Search</label>
                <div className="relative flex items-center mt-2 ml-4">  
                  <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    id="payment-search" 
                    className="block pt-2 pb-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for employee ID"
                  />
                  <div className="relative ml-4 flex space-x-2 items-center">
                    <div className="relative">
                      <input 
                        type="date" 
                        id="date-filter" 
                        className="block pt-2 pb-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        value={dateFilter}
                        onChange={(e) => {
                          setDateFilter(e.target.value);
                          // Clear date range when specific date is selected
                          if (e.target.value) {
                            setDateRangeFilter({ startDate: '', endDate: '' });
                          }
                        }}
                        placeholder="Filter by specific date"
                      />
                      {dateFilter && (
                        <button 
                          onClick={() => setDateFilter('')} 
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400">or</div>
                    
                    <div className="flex items-center space-x-1">
                      <input 
                        type="date" 
                        id="start-date-filter" 
                        className="block pt-2 pb-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-36" 
                        value={dateRangeFilter.startDate}
                        onChange={(e) => {
                          setDateRangeFilter(prev => ({...prev, startDate: e.target.value}));
                          // Clear specific date when range is used
                          if (e.target.value) {
                            setDateFilter('');
                          }
                        }}
                        placeholder="Start date"
                      />
                      <span className="text-gray-500">to</span>
                      <input 
                        type="date" 
                        id="end-date-filter" 
                        className="block pt-2 pb-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-36"
                        value={dateRangeFilter.endDate}
                        onChange={(e) => {
                          setDateRangeFilter(prev => ({...prev, endDate: e.target.value}));
                          // Clear specific date when range is used
                          if (e.target.value) {
                            setDateFilter('');
                          }
                        }}
                        placeholder="End date"
                      />
                      {(dateRangeFilter.startDate || dateRangeFilter.endDate) && (
                        <button 
                          onClick={() => setDateRangeFilter({startDate: '', endDate: ''})}
                          className="text-gray-500 hover:text-gray-700"
                          title="Clear date range"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={handleAddPayment} 
                    className="ml-auto mr-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    Record Payment
                  </button>
                </div>
              </div>
              {loading ? (
                <div className="text-center py-4">Loading payment data...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
              ) : (
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">Eid</th>
                      <th scope="col" className="px-6 py-3">Salary</th>
                      <th scope="col" className="px-6 py-3">PaidDate</th>
                      <th scope="col" className="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.length > 0 ? (
                      filteredPayments.map((payment) => (
                        <tr key={payment.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td className="px-6 py-4">{payment.eid}</td>
                          <td className="px-6 py-4">${parseFloat(payment.salary).toFixed(2)}</td>
                          <td className="px-6 py-4">{payment.paiddate ? new Date(payment.paiddate).toISOString().split('T')[0] : ''}</td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => handleDeletePayment(payment)} 
                              className="font-medium text-red-600 dark:text-red-500 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center">No payment records found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Bank Account Details Tab */}
        {activeTab === 'bankAccounts' && (
          <div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-3">
              <div className="pb-4 bg-white dark:bg-gray-900 pt-3">
                <label htmlFor="bank-account-search" className="sr-only">Search</label>
                <div className="relative flex items-center mt-2 ml-4">  
                  <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    id="bank-account-search" 
                    className="block pt-2 pb-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for employee ID"
                  />
                  <button 
                    onClick={() => {
                      setSelectedEmployee(null);
                      setModalDetails({
                        title: "Add Bank Account Details",
                        component: "BankAccountForm",
                        buttonName: "Add"
                      });
                      handleIsOpen();
                    }} 
                    className="ml-auto mr-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    Add Bank Account
                  </button>
                </div>
              </div>
              {loading ? (
                <div className="text-center py-4">Loading bank account data...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
              ) : (
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">Employee ID</th>
                      <th scope="col" className="px-6 py-3">Account Holder Name</th>
                      <th scope="col" className="px-6 py-3">Account Number</th>
                      <th scope="col" className="px-6 py-3">Bank Name</th>
                      <th scope="col" className="px-6 py-3">Branch Name</th>
                      <th scope="col" className="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bankAccounts.length > 0 ? (
                      // Filter bank accounts based on search term
                      bankAccounts.filter(account => 
                        searchTerm === "" || 
                        (account.eid && String(account.eid).toLowerCase().includes(searchTerm.toLowerCase()))
                      ).map((account) => (
                        <tr key={account.eid} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td className="px-6 py-4">{account.eid}</td>
                          <td className="px-6 py-4">{account.bankaccountholdername || "-"}</td>
                          <td className="px-6 py-4">{account.bankaccno || "-"}</td>
                          <td className="px-6 py-4">{account.bankname || "-"}</td>
                          <td className="px-6 py-4">{account.bankbranchname || "-"}</td>
                          <td className="px-6 py-4 flex space-x-2">
                            <button 
                              onClick={() => {
                                setSelectedEmployee(account);
                                setModalDetails({
                                  title: "Edit Bank Account Details",
                                  component: "BankAccountForm",
                                  buttonName: "Save"
                                });
                                handleIsOpen();
                              }} 
                              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedEmployee(account);
                                setModalDetails({
                                  title: "Delete Bank Account Details",
                                  component: "DeleteForm",
                                  objectName: "Bank Account",
                                  objectId: account.eid
                                });
                                handleIsOpen();
                              }} 
                              className="font-medium text-red-600 dark:text-red-500 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center">No bank account records found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Employee Salary Details Tab */}
        {activeTab === 'employeeSalaryDetails' && (
          <div>
            <EmployeeSalaryDetails />
          </div>
        )}
      </div>

      {isOpen && <Modal 
          sidebarToggle={sidebarToggle} 
          handleIsOpen={handleIsOpen} 
          modelDetails={modalDetails} 
          selectedObject={selectedEmployee}
      />}
    </div>
  )
}

export default Salary