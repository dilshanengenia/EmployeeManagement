import React, { useEffect, useState } from 'react';
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

const SalaryDashboard = () => {
  const [statistics, setStatistics] = useState({
    totalEmployees: 0,
    totalSalaryRecords: 0,
    averageSalary: 0,
    totalPayments: 0,
    recentPayments: []
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        let employees = [];
        let salaryRecords = [];
        let payments = [];
          // Fetch employees data with error handling
        try {
          const employeesResponse = await apiClient.get('/employees/');
          employees = employeesResponse.data;
        } catch (error) {
          console.error("Error fetching employees:", error);
          // Continue with other data fetching
        }
        
        // Fetch salary data with error handling
        try {
          const salaryResponse = await apiClient.get('/salary/');
          salaryRecords = salaryResponse.data;
        } catch (error) {
          console.error("Error fetching salary records:", error);
          // Continue with other data fetching
        }
        
        // Fetch payment data with error handling
        try {
          const paymentsResponse = await apiClient.get('/salary_payments/');
          payments = paymentsResponse.data;
        } catch (error) {
          console.error("Error fetching payments:", error);
          // Continue with what we have
        }
        
        // Calculate statistics        const totalEmployees = employees?.length || 0;
        const totalSalaryRecords = salaryRecords?.length || 0;
        
        let totalSalary = 0;
        let validSalaryCount = 0;
        
        if (salaryRecords && salaryRecords.length > 0) {
          salaryRecords.forEach(record => {
            const salaryValue = parseFloat(record.netsalary || 0);
            if (!isNaN(salaryValue) && salaryValue > 0) {
              totalSalary += salaryValue;
              validSalaryCount++;
            }
          });
        }
        
        const averageSalary = validSalaryCount > 0
          ? (totalSalary / validSalaryCount).toFixed(2)
          : 0;
          
        const totalPayments = payments.length;
        
        // Sort payments by date (descending) and take the most recent 5
        const recentPayments = payments.length > 0 
          ? [...payments]
              .sort((a, b) => new Date(b.paiddate) - new Date(a.paiddate))
              .slice(0, 5)
          : [];
          
        setStatistics({
          totalEmployees,
          totalSalaryRecords,
          averageSalary,
          totalPayments,
          recentPayments
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);  // Export salary data as CSV
  const exportSalaryReport = async () => {
    try {
      setLoading(true);
      // Fetch the salary data
      const salaryResponse = await apiClient.get('/salary/');
      const salaryRecords = salaryResponse.data;
      
      // Fetch the employee data to add more details to the report
      const employeeResponse = await apiClient.get('/employees/');
      const employees = employeeResponse.data;
      
      // Fetch payment data
      const paymentsResponse = await apiClient.get('/salary_payments/');
      const payments = paymentsResponse.data;
      
      // Find the most recent payment date for each employee
      const lastPaymentDates = {};
      payments.forEach(payment => {
        const eid = payment.eid;
        const paidDate = new Date(payment.paiddate);
        
        if (!lastPaymentDates[eid] || paidDate > new Date(lastPaymentDates[eid])) {
          lastPaymentDates[eid] = payment.paiddate;
        }
      });
      
      // Create an enhanced report with employee names and last payment date
      const enhancedRecords = salaryRecords.map(record => {
        // Find the employee to get their name
        const employee = employees.find(emp => emp.eid === record.eid);
        const employeeName = employee ? employee.fullname : 'Unknown';
        
        // Get the last payment date
        const lastPayment = lastPaymentDates[record.eid] || 'No payments';
        
        return {
          ...record,
          employeeName,
          lastPayment
        };
      });
        // Convert data to CSV format
      const headers = ['Employee ID', 'Employee Name', 'Basic Salary', 'Internet Charges', 'Allowances', 'Deductions', 'EPF Employee', 'EPF Employer', 'ETF Employer', 'Net Salary', 'Last Payment Date'];
      const csvRows = [
        headers.join(','),
        ...enhancedRecords.map(record => [
          record.eid,
          `"${record.employeeName}"`, // Add quotes to handle commas in names
          record.basicsalary,
          record.internetchages,
          record.allowances,
          record.deductions,
          record.epf_employee,
          record.epf_employer,
          record.etf_employer,
          record.netsalary,
          record.lastPayment
        ].join(','))
      ];
      
      const csvContent = csvRows.join('\n');
      
      // Create a Blob and download the file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      const today = new Date().toISOString().split('T')[0];
      a.setAttribute('download', `salary_report_${today}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success('Salary report exported successfully');
    } catch (error) {
      console.error('Error exporting salary data:', error);
      toast.error('Failed to export salary data');
    } finally {
      setLoading(false);
    }
  };
    // Handle mass payment functionality
  const handleMassPayment = async () => {
    if (!window.confirm("Are you sure you want to process salary payments for all employees? This will create payment records for all employees with salary data.")) {
      return;
    }
    
    try {
      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        // Call the mass payment API
      const response = await apiClient.post('/mass_payment/', {
        payment_date: today
      });
      
      if (response.data.success) {
        toast.success(`Successfully processed ${response.data.success_count} payments totaling $${response.data.total_amount.toFixed(2)}`);
        
        // If there were any failures, show them too
        if (response.data.failed_count > 0) {
          toast.warning(`Failed to process payments for ${response.data.failed_count} employees.`);
          console.error('Failed payments:', response.data.failed_payments);
        }
        
        // Refresh the dashboard data
        window.location.reload();
      } else {
        toast.error('Failed to process mass payment');
      }
    } catch (error) {
      console.error('Error processing mass payment:', error);
      toast.error(error.response?.data?.message || 'Failed to process mass payment');
    }
  };
  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mt-4"></div>
            <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Salary Statistics Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Employees with Salary Records */}
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
          <h3 className="text-sm font-medium text-blue-600 dark:text-blue-300">Employees</h3>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
            {statistics.totalSalaryRecords} / {statistics.totalEmployees}
          </p>
          <p className="text-xs text-blue-500 dark:text-blue-300">
            {((statistics.totalSalaryRecords / statistics.totalEmployees) * 100).toFixed(0)}% of employees have salary records
          </p>
        </div>
        
        {/* Average Salary */}
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg border border-green-100 dark:border-green-800">
          <h3 className="text-sm font-medium text-green-600 dark:text-green-300">Average Salary</h3>
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">${statistics.averageSalary}</p>
          <p className="text-xs text-green-500 dark:text-green-300">
            Average net salary across all employees
          </p>
        </div>
        
        {/* Total Payments */}
        <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
          <h3 className="text-sm font-medium text-purple-600 dark:text-purple-300">Total Payments</h3>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">{statistics.totalPayments}</p>
          <p className="text-xs text-purple-500 dark:text-purple-300">
            Total number of salary payments made
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              onClick={exportSalaryReport} 
              className="text-sm w-full bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
            >
              Export Reports
            </button>
            <button 
              onClick={handleMassPayment}
              className="text-sm w-full bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
            >
              Mass Payment
            </button>
          </div>
        </div>
      </div>
      
      {/* Recent Payments */}
      {statistics.recentPayments.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Recent Payments</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-2">Employee ID</th>
                  <th className="px-4 py-2">Salary</th>
                  <th className="px-4 py-2">Paid Date</th>
                </tr>
              </thead>
              <tbody>                  {statistics.recentPayments.map((payment) => (
                  <tr key={payment.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-4 py-2 font-medium">{payment.eid}</td>
                    <td className="px-4 py-2">${parseFloat(payment.salary).toFixed(2)}</td>
                    <td className="px-4 py-2">{new Date(payment.paiddate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryDashboard;
