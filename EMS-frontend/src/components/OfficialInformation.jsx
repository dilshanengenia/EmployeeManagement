import React, { useState } from 'react';
import { toast } from 'react-toastify';

const OfficialInformation = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    eid: '1',
    designation: 'Machine Learning Engineer',
    employeetype: 'Permanent',
    department: 'Data Science',
    empstatus: 'Active',
    usertype: 'Admin',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEdit = () => {
    if (isEditing) {
      const { eid, designation, employeetype, department, empstatus, usertype } = formData;

      if (
        !eid.trim() ||
        !designation.trim() ||
        !employeetype.trim() ||
        !department.trim() ||
        !empstatus.trim() ||
        !usertype.trim()
      ) {
        toast.error('Please fill out all fields before saving.');
        return;
      }

      // Save logic here (e.g., API call)
      console.log('Saving Official Info:', formData);
      toast.success('Official information saved successfully!');
    }

    setIsEditing(!isEditing);
  };

  return (
    <div className="grid grid-cols-1">
      <div className="flex justify-between items-center py-2 border-b border-t border-gray-500 my-4">
        <p className="text-white text-lg font-semibold tracking-wide">
          --- Official Informations ---
        </p>
        <button
          onClick={toggleEdit}
          className="px-3 py-1 bg-blue-600 rounded text-white hover:bg-blue-700"
          type="button"
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block mb-2 dark:text-gray-300">Employee ID</label>
          <input
            type="text"
            name="eid"
            disabled={!isEditing}
            value={formData.eid}
            onChange={handleChange}
            className="p-4 w-full border-2 rounded-lg dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
            placeholder="Employee ID"
          />
        </div>

        <div>
          <label className="block mb-2 dark:text-gray-300">Designation</label>
          <input
            type="text"
            name="designation"
            disabled={!isEditing}
            value={formData.designation}
            onChange={handleChange}
            className="p-4 w-full border-2 rounded-lg dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
            placeholder="Designation"
          />
        </div>

        <div>
          <label className="block mb-2 dark:text-gray-300">Employee Type</label>
          <select
            name="employeetype"
            disabled={!isEditing}
            value={formData.employeetype}
            onChange={handleChange}
            className="w-full border-2 rounded-lg p-4 dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="">-- Select Employee Type --</option>
            <option value="Intern">Intern</option>
            <option value="Permanent">Permanent</option>
            <option value="Freelance">Freelance</option>
            <option value="Parttime">Parttime</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 dark:text-gray-300">Department</label>
          <select
            name="department"
            disabled={!isEditing}
            value={formData.department}
            onChange={handleChange}
            className="w-full border-2 rounded-lg p-4 dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="">-- Select Department --</option>
            <option value="Data Science">Data Science</option>
            <option value="Finance">Finance</option>
            <option value="Sales & Marketing">Sales & Marketing</option>
            <option value="Human Resources">Human Resources</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 dark:text-gray-300">Status</label>
          <select
            name="empstatus"
            disabled={!isEditing}
            value={formData.empstatus}
            onChange={handleChange}
            className="w-full border-2 rounded-lg p-4 dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="">-- Select Status --</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Retired">Retired</option>
            <option value="Resigned">Resigned</option>
            <option value="Fired">Fired</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 dark:text-gray-300">User Type</label>
          <select
            name="usertype"
            disabled={!isEditing}
            value={formData.usertype}
            onChange={handleChange}
            className="w-full border-2 rounded-lg p-4 dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="">-- Select User Type --</option>
            <option value="Admin">Admin</option>
            <option value="HR">HR</option>
            <option value="Employee">Employee</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default OfficialInformation;
