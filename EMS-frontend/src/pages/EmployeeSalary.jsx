import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaMoneyBillAlt, FaUser } from 'react-icons/fa';
import apiClient from '../services/apiClient';

const EmployeeSalary = () => {
  const { sidebarToggle } = useOutletContext();  const [salaryData, setSalaryData] = useState(null);
  const [bankAccount, setBankAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employeeInfo, setEmployeeInfo] = useState(null);

  const userId = localStorage.getItem('userId');  useEffect(() => {
    if (userId) {
      fetchEmployeeSalaryData();
      fetchBankAccountData();
      fetchEmployeeInfo();
    }
  }, [userId]);
  const fetchEmployeeInfo = async () => {
    try {
      const response = await apiClient.get(`/employees/${userId}`);
      setEmployeeInfo(response.data);
    } catch (error) {
      console.error('Error fetching employee info:', error);
    }
  };

  const fetchEmployeeSalaryData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/salary/${userId}`);
      setSalaryData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching salary data:', error);
      setError('Failed to fetch salary information');
    } finally {
      setLoading(false);
    }
  };
  const fetchBankAccountData = async () => {
    try {
      const response = await apiClient.get(`/bank_accounts/${userId}`);
      setBankAccount(response.data);
    } catch (error) {
      console.error('Error fetching bank account data:', error);
    }
  };
  return (
    <div className={`${sidebarToggle ? "ml-20" : "ml-64"} p-6`}>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-black mt-4 mb-6 text-center border-b pb-2">
        My Salary Details
      </h1>

      {/* Employee Information */}
      {employeeInfo && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <FaUser className="text-3xl text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Employee ID: {userId}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {employeeInfo.firstname} {employeeInfo.lastname}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && !salaryData ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-600 dark:text-gray-400">Loading salary information...</p>
        </div>
      ) : salaryData ? (
        <>
          {/* Current Salary Overview */}
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
          </div>          {/* Salary Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Current Salary Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Earnings</h3>
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
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Deductions</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">EPF Employee (8%):</span>
                    <span className="font-medium">LKR {parseFloat(salaryData.epf_employee || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Other Deductions:</span>
                    <span className="font-medium">
                      LKR {(parseFloat(salaryData.deductions || 0) - parseFloat(salaryData.epf_employee || 0)).toLocaleString()}
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
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Bank Account Details</h2>
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
      ) : (        <div className="text-center text-gray-600 dark:text-gray-400 mt-8">
          No salary information available
        </div>
      )}
    </div>
  );
};

export default EmployeeSalary;
