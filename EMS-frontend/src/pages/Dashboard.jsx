import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom';
import apiClient from '../services/apiClient';

const Dashboard = () => {
  const { sidebarToggle } = useOutletContext();
  const [userRole, setUserRole] = useState('');
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem('userRole') || '';
    setUserRole(role);
    
    // Fetch dashboard statistics
    fetchDashboardStatistics();
  }, []);

  const fetchDashboardStatistics = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/dashboard/statistics/');
      setStatistics(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
      console.error('Error fetching dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Component for individual statistic cards
  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-full ${color.replace('border-l-', 'bg-').replace('-500', '-100')} flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  // Component for summary sections
  const SummaryCard = ({ title, data, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className={`text-lg font-semibold mb-4 ${color}`}>{title}</h3>
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center">
            <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
            <span className="font-semibold text-gray-800">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`${sidebarToggle ? "ml-20": " ml-64 "}`}>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-black mt-8 mb-6 text-center border-b pb-2">
        Dashboard
      </h1>
      
      <div className="px-6">
        {/* Welcome Section */}
        <div className="p-6 bg-white rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Welcome, {userRole === 'admin' ? 'Administrator' : 'HR Manager'}!
          </h2>
          <p className="text-gray-600 mb-4">
            {userRole === 'admin' 
              ? 'You have full access to all features of the Employee Management System.' 
              : 'You have access to most features of the Employee Management System, except Settings.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading dashboard statistics...</p>
          </div>
        ) : statistics && (
          <>
            {/* Main Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Employees"
                value={statistics.total_employees}
                subtitle={`${statistics.active_employees} active`}
                color="border-l-blue-500"
                icon={<span className="text-blue-600">👥</span>}
              />
              <StatCard
                title="Total Departments"
                value={statistics.total_departments}
                color="border-l-green-500"
                icon={<span className="text-green-600">🏢</span>}
              />
              <StatCard
                title="Total Net Salaries"
                value={`$${statistics.total_salaries.toLocaleString()}`}
                subtitle="Total net salaries"
                color="border-l-yellow-500"
                icon={<span className="text-yellow-600">💰</span>}
              />
              <StatCard
                title="Recent Activities"
                value={statistics.recent_activities.recent_leave_applications + statistics.recent_activities.recent_salary_payments}
                subtitle="Last 30 days"
                color="border-l-purple-500"
                icon={<span className="text-purple-600">📊</span>}
              />
            </div>

            {/* Summary Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Leave Summary */}
              <SummaryCard
                title="📋 Leave Summary"
                color="text-blue-600"
                data={{
                  'Total Applications': statistics.leave_summary.total_applications,
                  'Pending': statistics.leave_summary.pending,
                  'Approved': statistics.leave_summary.approved,
                  'Rejected': statistics.leave_summary.rejected,
                  'Recent (30 days)': statistics.leave_summary.recent_applications
                }}
              />

              {/* Resource Summary */}
              <SummaryCard
                title="🔧 Resource Summary"
                color="text-green-600"
                data={{
                  'Total Resources': statistics.resource_summary.total_resources,
                  'Currently Allocated': statistics.resource_summary.allocated,
                  'Returned': statistics.resource_summary.returned
                }}
              />

              {/* Training Summary */}
              <SummaryCard
                title="🎓 Training Summary"
                color="text-purple-600"
                data={{
                  'Total Budgets': statistics.training_summary.total_budgets,
                  'Total Requests': statistics.training_summary.total_requests,
                  'Pending Requests': statistics.training_summary.pending_requests,
                  'Approved Requests': statistics.training_summary.approved_requests
                }}
              />
            </div>

            {/* Training Budget Details */}
            <div className="mt-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-purple-600 mb-4">💼 Training Budget Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Total Budget Amount</span>
                    <span className="text-2xl font-bold text-purple-600">
                      ${statistics.training_summary.total_budget_amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Remaining Budget</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${statistics.training_summary.remaining_budget.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${(statistics.training_summary.remaining_budget / statistics.training_summary.total_budget_amount) * 100}%`
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {((statistics.training_summary.remaining_budget / statistics.training_summary.total_budget_amount) * 100).toFixed(1)}% 
                    of total budget remaining
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard