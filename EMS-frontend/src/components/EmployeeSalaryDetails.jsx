import React, { useState, useEffect } from 'react';
import { FaMoneyBillAlt, FaUser, FaDownload, FaEye, FaSearch } from 'react-icons/fa';
import apiClient from '../services/apiClient';

const EmployeeSalaryDetails = ({ onClose }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [salaryData, setSalaryData] = useState(null);
  const [bankAccount, setBankAccount] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async () => {
    if (!employeeId.trim()) {
      setError('Please enter an employee ID');
      return;
    }

    setLoading(true);
    setError(null);
    setSearchPerformed(true);

    try {
      // Fetch employee information
      await fetchEmployeeInfo(employeeId);
      
      // Fetch salary data
      await fetchSalaryData(employeeId);
      
      // Fetch bank account data
      await fetchBankAccountData(employeeId);
      
      // Fetch payment history
      await fetchPaymentHistory(employeeId);
      
    } catch (error) {
      console.error('Error during search:', error);
      setError('Failed to fetch employee data. Please check the employee ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeInfo = async (eid) => {
    try {
      const response = await apiClient.get(`/employees/${eid}`);
      setEmployeeInfo(response.data);
    } catch (error) {
      console.error('Error fetching employee info:', error);
      throw error;
    }
  };

  const fetchSalaryData = async (eid) => {
    try {
      const response = await apiClient.get(`/salary/${eid}`);
      setSalaryData(response.data);
    } catch (error) {
      console.error('Error fetching salary data:', error);
      throw error;
    }
  };

  const fetchBankAccountData = async (eid) => {
    try {
      const response = await apiClient.get(`/bank_accounts/${eid}`);
      setBankAccount(response.data);
    } catch (error) {
      console.error('Error fetching bank account data:', error);
      // Don't throw error for bank account as it might not exist
    }
  };

  const fetchPaymentHistory = async (eid) => {
    try {
      const response = await apiClient.get('/salary_payments/');
      // Filter payments for the specific employee
      const employeePayments = response.data.filter(payment => 
        String(payment.eid) === String(eid)
      );
      
      setPaymentHistory(employeePayments);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      // Don't throw error for payment history as it might be empty
    }
  };

  const downloadPayslip = (payment) => {
    // Mock download functionality
    alert(`Downloading payslip for Employee ${payment.eid} - ${payment.paiddate}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Employee Salary Details
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Employee ID
            </label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter employee ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FaSearch />
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-600 dark:text-gray-400">Loading employee data...</p>
        </div>
      )}

      {/* Results */}
      {searchPerformed && !loading && !error && (
        <>
          {/* Employee Information */}
          {employeeInfo && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center gap-4">
                <FaUser className="text-3xl text-blue-500" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Employee ID: {employeeId}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {employeeInfo.firstname} {employeeInfo.lastname}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Department: {employeeInfo.dno || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Salary Information */}
          {salaryData ? (
            <>
              {/* Salary Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Basic Salary</h3>
                      <p className="text-2xl font-bold text-blue-600">
                        LKR {parseFloat(salaryData.basicsalary || 0).toLocaleString()}
                      </p>
                    </div>
                    <FaMoneyBillAlt className="text-3xl text-blue-500" />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Allowances</h3>
                      <p className="text-2xl font-bold text-green-600">
                        LKR {parseFloat(salaryData.allowances || 0).toLocaleString()}
                      </p>
                    </div>
                    <FaMoneyBillAlt className="text-3xl text-green-500" />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Deductions</h3>
                      <p className="text-2xl font-bold text-red-600">
                        LKR {parseFloat(salaryData.deductions || 0).toLocaleString()}
                      </p>
                    </div>
                    <FaMoneyBillAlt className="text-3xl text-red-500" />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Net Salary</h3>
                      <p className="text-2xl font-bold text-purple-600">
                        LKR {parseFloat(salaryData.netsalary || 0).toLocaleString()}
                      </p>
                    </div>
                    <FaMoneyBillAlt className="text-3xl text-purple-500" />
                  </div>
                </div>
              </div>

              {/* Detailed Salary Breakdown */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Salary Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Earnings</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Basic Salary:</span>
                        <span className="font-medium">LKR {parseFloat(salaryData.basicsalary || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Allowances:</span>
                        <span className="font-medium">LKR {parseFloat(salaryData.allowances || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Internet Charges:</span>
                        <span className="font-medium">LKR {parseFloat(salaryData.internetchages || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Gross Salary:</span>
                        <span className="font-semibold">
                          LKR {(parseFloat(salaryData.basicsalary || 0) + parseFloat(salaryData.allowances || 0) + parseFloat(salaryData.internetchages || 0)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Deductions</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">EPF Employee (8%):</span>
                        <span className="font-medium">LKR {parseFloat(salaryData.epf_employee || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Other Deductions:</span>
                        <span className="font-medium">
                          LKR {Math.max(0, parseFloat(salaryData.deductions || 0) - parseFloat(salaryData.epf_employee || 0)).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Total Deductions:</span>
                        <span className="font-semibold">LKR {parseFloat(salaryData.deductions || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Net Salary:</span>
                    <span className="text-green-600">LKR {parseFloat(salaryData.netsalary || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Bank Account Details */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Bank Account Details</h3>
                {bankAccount ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Account Holder:</span>
                      <p className="font-medium text-lg">{bankAccount.bankaccountholdername || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Account Number:</span>
                      <p className="font-medium text-lg">{bankAccount.bankaccno || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Bank:</span>
                      <p className="font-medium text-lg">{bankAccount.bankname || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Branch:</span>
                      <p className="font-medium text-lg">{bankAccount.bankbranchname || 'N/A'}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No bank account details found</p>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <p className="text-center text-gray-600 dark:text-gray-400">
                No salary information found for Employee ID: {employeeId}
              </p>
            </div>
          )}

          {/* Payment History */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Payment History</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3">Employee ID</th>
                    <th className="px-6 py-3">Paid Date</th>
                    <th className="px-6 py-3">Salary Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.length > 0 ? (
                    paymentHistory.map((payment, index) => (
                      <tr key={payment.id || index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {payment.eid}
                        </td>
                        <td className="px-6 py-4">
                          {payment.paiddate ? new Date(payment.paiddate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 font-bold text-green-600">
                          LKR {parseFloat(payment.salary || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Paid
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => downloadPayslip(payment)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                              title="Download Payslip"
                            >
                              <FaDownload />
                            </button>
                            <button
                              className="text-gray-600 hover:text-gray-800 dark:text-gray-400"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No payment history found for Employee ID: {employeeId}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeSalaryDetails;
