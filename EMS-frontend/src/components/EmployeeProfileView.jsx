import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';

const EmployeeProfileView = () => {
  const { eid } = useParams();
  const navigate = useNavigate();
  const { sidebarToggle } = useOutletContext();
  
  const [employee, setEmployee] = useState(null);
  const [editedEmployee, setEditedEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchEmployeeDetails();
    fetchDepartments();
  }, [eid]);

  const fetchEmployeeDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/employee_details/${eid}/`);
      if (response.ok) {
        const data = await response.json();
        setEmployee(data);
        // Use the data directly with correct field names
        setEditedEmployee({
          ...data
        });
      } else {
        setError('Employee not found');
      }
    } catch (error) {
      setError('Error fetching employee details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:8000/departments/');
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Set up editing data using exact database field names
    setEditedEmployee({
      ...employee
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data using exact database field names
    setEditedEmployee({
      ...employee
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Use the edited employee data directly since it now uses correct field names
      const dataToSend = {
        eid: employee.eid,
        ...editedEmployee
      };

      const response = await fetch(`http://localhost:8000/employee_details/${eid}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        const updatedData = await response.json();
        setEmployee(updatedData);
        setEditedEmployee({ ...updatedData });
        setIsEditing(false);
        toast.success('Employee details updated successfully!');
      } else {
        const errorData = await response.json();
        toast.error('Error updating employee details');
        console.error('Error:', errorData);
      }
    } catch (error) {
      toast.error('Error updating employee details');
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className={`${sidebarToggle ? "ml-20" : "ml-64"} py-10 dark:bg-gray-900 min-h-screen`}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${sidebarToggle ? "ml-20" : "ml-64"} py-10 dark:bg-gray-900 min-h-screen`}>
        <div className="text-center text-red-500 text-xl mt-10">{error}</div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className={`${sidebarToggle ? "ml-20" : "ml-64"} py-10 dark:bg-gray-900 min-h-screen`}>
        <div className="text-center text-white text-xl mt-10">Employee not found</div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString;
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const EditableInfoRow = ({ label, name, value, displayValue, type = "text", options = null, required = false }) => {
    // Use editedEmployee value when editing, displayValue when viewing
    const currentValue = isEditing ? (editedEmployee?.[name] || '') : (displayValue !== undefined ? displayValue : value);
    
    return (
      <tr className="border-b border-gray-200 dark:border-gray-700">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800">
          {label} {required && <span className="text-red-500">*</span>}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
          {isEditing ? (
            options ? (
              <select
                name={name}
                value={currentValue}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select {label}</option>
                {options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : type === "textarea" ? (
              <textarea
                name={name}
                value={currentValue}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <input
                type={type}
                name={name}
                value={currentValue}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            )
          ) : (
            <span>{type === "date" ? formatDateForDisplay(currentValue) : (currentValue || 'N/A')}</span>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className={`${sidebarToggle ? "ml-20" : "ml-64"} py-10 dark:bg-gray-900 min-h-screen`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-6">
        <div className="flex items-center space-x-4">
          <button 
            type="button" 
            onClick={goBack} 
            className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
          >
            ← Go Back
          </button>
          <h1 className="text-3xl font-bold text-white">
            Employee Profile
          </h1>
        </div>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleCancel}
                disabled={saving}
                className="text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800 disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button 
              onClick={handleEdit}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Employee Profile Content */}
      <div className="lg:w-[90%] md:w-[95%] w-[98%] mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden">
          
          {/* Employee Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-2xl font-bold">
                  {(employee?.fullname?.charAt(0) || 'E').toUpperCase()}
                </div>
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold">{employee?.fullname || 'Employee Name'}</h2>
                <p className="text-xl opacity-90">{employee?.designation || 'Job Title'}</p>
                <p className="text-lg opacity-75">ID: {employee?.eid}</p>
              </div>
            </div>
          </div>

          {/* Employee Details Tables */}
          <div className="p-6">
            
            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                Personal Information
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800">
                  <tbody>
                    <EditableInfoRow 
                      label="Full Name" 
                      name="fullname" 
                      displayValue={employee?.fullname}
                      required 
                    />
                    <EditableInfoRow 
                      label="Name with Initials" 
                      name="initname" 
                      displayValue={employee?.initname}
                    />
                    <EditableInfoRow 
                      label="Email" 
                      name="email" 
                      displayValue={employee?.email}
                      type="email" 
                      required 
                    />
                    <EditableInfoRow 
                      label="Phone" 
                      name="phone" 
                      displayValue={employee?.phone}
                      type="tel" 
                    />
                    <EditableInfoRow 
                      label="Date of Birth" 
                      name="dob" 
                      displayValue={employee?.dob}
                      type="date" 
                    />
                    <EditableInfoRow 
                      label="Gender" 
                      name="gender" 
                      displayValue={employee?.gender}
                      options={[
                        { value: 'Male', label: 'Male' },
                        { value: 'Female', label: 'Female' },
                        { value: 'Other', label: 'Other' }
                      ]} 
                    />
                    <EditableInfoRow 
                      label="Marital Status" 
                      name="maritialstatus" 
                      displayValue={employee?.maritialstatus}
                      options={[
                        { value: 'Single', label: 'Single' },
                        { value: 'Married', label: 'Married' },
                        { value: 'Divorced', label: 'Divorced' },
                        { value: 'Widowed', label: 'Widowed' }
                      ]} 
                    />
                    <EditableInfoRow 
                      label="Address" 
                      name="address" 
                      displayValue={employee?.address}
                      type="textarea" 
                    />
                    <EditableInfoRow 
                      label="Country" 
                      name="country" 
                      displayValue={employee?.country}
                    />
                  </tbody>
                </table>
              </div>
            </div>

            {/* Official Information */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                Official Information
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800">
                  <tbody>
                    <EditableInfoRow 
                      label="Designation" 
                      name="designation" 
                      displayValue={employee?.designation}
                    />
                    <EditableInfoRow 
                      label="Department" 
                      name="department" 
                      displayValue={employee?.department}
                    />
                    <EditableInfoRow 
                      label="Employee Type" 
                      name="employeetype" 
                      displayValue={employee?.employeetype}
                      options={[
                        { value: 'Full-time', label: 'Full-time' },
                        { value: 'Part-time', label: 'Part-time' },
                        { value: 'Contract', label: 'Contract' },
                        { value: 'Intern', label: 'Intern' }
                      ]} 
                    />
                    <EditableInfoRow 
                      label="Status" 
                      name="status" 
                      displayValue={employee?.status}
                      options={[
                        { value: 'Active', label: 'Active' },
                        { value: 'Inactive', label: 'Inactive' },
                        { value: 'Suspended', label: 'Suspended' },
                        { value: 'Terminated', label: 'Terminated' }
                      ]} 
                    />
                    <EditableInfoRow 
                      label="User Type" 
                      name="usertype" 
                      displayValue={employee?.usertype}
                    />
                  </tbody>
                </table>
              </div>
            </div>

            {isEditing && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <p className="font-medium mb-2">Editing Instructions:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Required fields are marked with a red asterisk (*)</li>
                  <li>Make sure to fill in all required information before saving</li>
                  <li>Use the Cancel button to discard changes</li>
                  <li>Click Save Changes to update the employee profile</li>
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfileView;
