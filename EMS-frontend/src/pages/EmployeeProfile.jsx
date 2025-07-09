import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import apiClient from '../services/apiClient';

const EmployeeProfile = () => {
  const { sidebarToggle } = useOutletContext();
  const [employeeData, setEmployeeData] = useState(null);
  const [salaryData, setSalaryData] = useState(null);
  const [bankData, setBankData] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  
  const coverimageurl = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80';
  
  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        setError('User ID not found in session');
        return;
      }

      // Fetch employee details
      const employeeResponse = await apiClient.get(`/employee_details/${userId}/`);
      setEmployeeData(employeeResponse.data);

      // Fetch salary data
      try {
        const salaryResponse = await apiClient.get(`/salary/${userId}/`);
        setSalaryData(salaryResponse.data);
      } catch (err) {
        console.log('No salary data found for this employee');
      }

      // Fetch bank account data
      try {
        const bankResponse = await apiClient.get(`/bank_accounts/${userId}/`);
        setBankData(bankResponse.data);
      } catch (err) {
        console.log('No bank account data found for this employee');
      }

      // Fetch leave balance
      try {
        const leaveResponse = await apiClient.get(`/employee_leave_balances/${userId}/`);
        setLeaveBalance(leaveResponse.data);
      } catch (err) {
        console.log('No leave balance data found for this employee');
      }

      setError(null);
    } catch (err) {
      setError('Failed to fetch employee data');
      console.error('Error fetching employee data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Tab component with enhanced styling
  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-6 py-4 font-bold text-base rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg border-2 ${
        isActive
          ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-2xl border-blue-600 scale-105'
          : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-blue-300 hover:text-blue-700 hover:shadow-xl'
      }`}
    >
      <span className="text-lg">{label}</span>
    </button>
  );

  // Information card component with enhanced styling
  const InfoCard = ({ title, children, icon, gradient = false }) => (
    <div className={`bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
      gradient ? 'bg-gradient-to-br from-white to-blue-50' : ''
    }`}>
      <div className="flex items-center mb-8 pb-4 border-b-2 border-gray-100">
        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-5 shadow-lg transform hover:scale-110 transition-transform duration-200">
          <span className="text-white text-2xl">{icon}</span>
        </div>
        <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{title}</h3>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );

  // Info row component with enhanced styling
  const InfoRow = ({ label, value, icon, highlight = false, type = 'text' }) => {
    const formatValue = (val, dataType) => {
      if (!val || val === 'N/A') return 'N/A';
      
      switch (dataType) {
        case 'currency':
          return formatCurrency(val);
        case 'date':
          return formatDate(val);
        case 'status':
          return (
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              val === 'Active' ? 'bg-green-100 text-green-800' : 
              val === 'Inactive' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {val}
            </span>
          );
        default:
          return val;
      }
    };

    return (
      <div className={`flex justify-between items-center py-5 px-4 border-b border-gray-100 last:border-b-0 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all duration-300 group ${
        highlight ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' : ''
      }`}>
        <div className="flex items-center space-x-3">
          {icon && (
            <span className="text-blue-600 text-lg group-hover:scale-110 transition-transform duration-200">
              {icon}
            </span>
          )}
          <span className="font-bold text-gray-800 text-lg">{label}:</span>
        </div>
        <div className="text-right">
          <span className="text-gray-900 text-lg font-semibold">
            {formatValue(value, type)}
          </span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`${sidebarToggle ? "ml-20" : "ml-64"} p-6`}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading employee profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${sidebarToggle ? "ml-20" : "ml-64"} p-6`}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`${sidebarToggle ? "ml-20" : "ml-64"} p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mt-4 mb-8 text-center pb-6 border-b-4 border-gradient-to-r from-blue-600 to-indigo-600">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Employee Profile
          </span>
        </h1>
      
      {/* Cover Image and Profile Section */}
      <div className="relative mb-12">
        <div 
          className="h-64 bg-cover bg-center rounded-2xl shadow-2xl"
          style={{ backgroundImage: `url(${coverimageurl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 rounded-2xl"></div>
        </div>
        
        {/* Profile Picture and Basic Info */}
        <div className="absolute -bottom-20 left-12">
          <div className="flex items-end space-x-8">
            <div className="relative">
              <img
                src={employeeData?.image || 'https://via.placeholder.com/150?text=Employee'}
                alt="Profile"
                className="w-40 h-40 rounded-2xl border-6 border-white shadow-2xl object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150?text=Employee';
                }}
              />
              <div className={`absolute bottom-3 right-3 w-8 h-8 rounded-full border-4 border-white shadow-lg ${
                employeeData?.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
            </div>
            <div className="pb-6">
              <h2 className="text-3xl font-bold text-white mb-2">{employeeData?.fullname}</h2>
              <p className="text-white/90 text-xl font-medium mb-1">{employeeData?.designation}</p>
              <p className="text-white/75 text-lg">Employee ID: {employeeData?.eid}</p>
              <div className="flex items-center mt-3">
                <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                  employeeData?.status === 'Active' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {employeeData?.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="mt-24 mb-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <TabButton id="personal" label="👤 Personal Info" isActive={activeTab === 'personal'} onClick={setActiveTab} />
          <TabButton id="official" label="🏢 Official Info" isActive={activeTab === 'official'} onClick={setActiveTab} />
          <TabButton id="contact" label="📞 Contact Info" isActive={activeTab === 'contact'} onClick={setActiveTab} />
          <TabButton id="education" label="🎓 Education" isActive={activeTab === 'education'} onClick={setActiveTab} />
          <TabButton id="salary" label="💰 Salary & Benefits" isActive={activeTab === 'salary'} onClick={setActiveTab} />
          <TabButton id="leave" label="📅 Leave Balance" isActive={activeTab === 'leave'} onClick={setActiveTab} />
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <InfoCard title="Personal Information" icon="👤" gradient={true}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-1">
                <InfoRow label="Full Name" value={employeeData?.fullname} icon="👨‍💼" />
                <InfoRow label="Initial Name" value={employeeData?.initname} icon="✍️" />
                <InfoRow label="Gender" value={employeeData?.gender} icon="⚧" />
                <InfoRow label="Date of Birth" value={employeeData?.dob} icon="🎂" type="date" />
              </div>
              <div className="space-y-1">
                <InfoRow label="Marital Status" value={employeeData?.maritialstatus} icon="💍" />
                <InfoRow label="Country" value={employeeData?.country} icon="🌍" />
                <InfoRow label="Address" value={employeeData?.address} icon="🏠" />
              </div>
            </div>
          </InfoCard>
        )}

        {/* Official Information Tab */}
        {activeTab === 'official' && (
          <InfoCard title="Official Information" icon="🏢" gradient={true}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-1">
                <InfoRow label="Employee ID" value={employeeData?.eid} icon="🆔" highlight={true} />
                <InfoRow label="Designation" value={employeeData?.designation} icon="💼" />
                <InfoRow label="Department" value={employeeData?.department} icon="🏪" />
                <InfoRow label="Employee Type" value={employeeData?.employeetype} icon="👥" />
              </div>
              <div className="space-y-1">
                <InfoRow label="User Type" value={employeeData?.usertype} icon="🔑" />
                <InfoRow label="Status" value={employeeData?.status} icon="📊" type="status" />
              </div>
            </div>
          </InfoCard>
        )}

        {/* Contact Information Tab */}
        {activeTab === 'contact' && (
          <InfoCard title="Contact Information" icon="📞" gradient={true}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-1">
                <InfoRow label="Email" value={employeeData?.email} icon="📧" />
                <InfoRow label="Email Type" value={employeeData?.emailtype} icon="📮" />
              </div>
              <div className="space-y-1">
                <InfoRow label="Phone" value={employeeData?.phone} icon="📱" />
                <InfoRow label="Phone Type" value={employeeData?.phonetype} icon="☎️" />
              </div>
            </div>
          </InfoCard>
        )}

        {/* Education Tab */}
        {activeTab === 'education' && (
          <InfoCard title="Educational Qualifications" icon="🎓" gradient={true}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-1">
                <InfoRow label="Degree" value={employeeData?.degree} icon="📜" />
                <InfoRow label="Education Level" value={employeeData?.educationlevel} icon="📚" />
                <InfoRow label="University" value={employeeData?.university} icon="🏫" />
              </div>
              <div className="space-y-1">
                <InfoRow label="Started Year" value={employeeData?.startedyear} icon="📅" />
                <InfoRow label="Completed Year" value={employeeData?.completedyear} icon="🏁" />
                <InfoRow label="Education Status" value={employeeData?.educationstatus} icon="✅" type="status" />
              </div>
            </div>
          </InfoCard>
        )}

        {/* Salary & Benefits Tab */}
        {activeTab === 'salary' && (
          <>
            <InfoCard title="Salary Information" icon="💰" gradient={true}>
              {salaryData ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <InfoRow label="Basic Salary" value={salaryData.basicsalary} icon="💵" type="currency" highlight={true} />
                    <InfoRow label="Internet Charges" value={salaryData.internetchages} icon="🌐" type="currency" />
                    <InfoRow label="Allowances" value={salaryData.allowances} icon="💲" type="currency" />
                  </div>
                  <div className="space-y-1">
                    <InfoRow label="Deductions" value={salaryData.deductions} icon="➖" type="currency" />
                    <InfoRow label="EPF Employee" value={salaryData.epf_employee} icon="🏦" type="currency" />
                    <InfoRow label="EPF Employer" value={salaryData.epf_employer} icon="🏢" type="currency" />
                    <InfoRow label="ETF Employer" value={salaryData.etf_employer} icon="📊" type="currency" />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💼</div>
                  <p className="text-gray-500 text-lg">No salary information available</p>
                </div>
              )}
            </InfoCard>

            <InfoCard title="Bank Account Details" icon="🏦" gradient={true}>
              {bankData ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <InfoRow label="Account Holder Name" value={bankData.bankaccountholdername} icon="👤" />
                    <InfoRow label="Account Number" value={bankData.bankaccno} icon="🔢" highlight={true} />
                  </div>
                  <div className="space-y-1">
                    <InfoRow label="Bank Name" value={bankData.bankname} icon="🏛️" />
                    <InfoRow label="Branch Name" value={bankData.bankbranchname} icon="🏪" />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏦</div>
                  <p className="text-gray-500 text-lg">No bank account information available</p>
                </div>
              )}
            </InfoCard>
          </>
        )}

        {/* Leave Balance Tab */}
        {activeTab === 'leave' && (
          <InfoCard title="Leave Balance" icon="📅" gradient={true}>
            {leaveBalance ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <InfoRow label="Total Annual Leaves" value={leaveBalance.totalannualleaves} icon="🏖️" />
                  <InfoRow label="Annual Leave Balance" value={leaveBalance.annualleavebalance} icon="⚖️" highlight={true} />
                </div>
                <div className="space-y-1">
                  <InfoRow label="Total Casual Leaves" value={leaveBalance.totalcasualleaves} icon="☕" />
                  <InfoRow label="Casual Leave Balance" value={leaveBalance.casualleavebalance} icon="⚖️" highlight={true} />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-gray-500 text-lg">No leave balance information available</p>
              </div>
            )}
          </InfoCard>
        )}
      </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
