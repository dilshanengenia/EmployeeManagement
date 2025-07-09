import React, { useState } from 'react';
import { toast } from 'react-toastify';

const PersonalInformation = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fname: 'Ehelapage Don Chamika Dilshan Anuruddha',
    initname: 'EDCD Anuruddha',
    gender: 'Male',
    dob: '1998-09-13',
    maritalStatus: 'Married',
    address: '70/3/C Samagi Mawahta, Makuluduwa, Piliyandala',
    country: 'Sri Lanka',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEdit = () => {
    if (isEditing) {
      const {
        fname,
        initname,
        gender,
        dob,
        maritalStatus,
        address,
        country,
      } = formData;

      if (
        !fname.trim() ||
        !initname.trim() ||
        !gender.trim() ||
        !dob.trim() ||
        !maritalStatus.trim() ||
        !address.trim() ||
        !country.trim()
      ) {
        toast.error('Please fill out all fields before saving.');
        return;
      }

      // Save logic here
      console.log('Saving data', formData);
      toast.success('Personal information saved successfully!');
    }

    setIsEditing(!isEditing);
  };

  return (
    <div className="grid grid-cols-1">
      <div className="flex justify-between items-center py-2 border-b border-t border-gray-500 my-4">
        <p className="text-white text-lg font-semibold tracking-wide">
          --- Personal Informations ---
        </p>
        <button
          onClick={toggleEdit}
          className="px-3 py-1 bg-blue-600 rounded text-white hover:bg-blue-700"
          type="button"
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 dark:text-gray-300">Full Name</label>
          <input
            type="text"
            name="fname"
            disabled={!isEditing}
            value={formData.fname}
            onChange={handleChange}
            className="p-4 w-full border-2 rounded-lg dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
            placeholder="Full Name"
          />
        </div>
        <div>
          <label className="block mb-2 dark:text-gray-300">Name with Initials</label>
          <input
            type="text"
            name="initname"
            disabled={!isEditing}
            value={formData.initname}
            onChange={handleChange}
            className="p-4 w-full border-2 rounded-lg dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
            placeholder="Name with Initials"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div>
          <label className="block mb-2 dark:text-gray-300">Gender</label>
          <select
            name="gender"
            disabled={!isEditing}
            value={formData.gender}
            onChange={handleChange}
            className="w-full border-2 rounded-lg p-4 dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="">-- Select Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 dark:text-gray-300">Date of Birth</label>
          <input
            type="date"
            name="dob"
            disabled={!isEditing}
            value={formData.dob}
            onChange={handleChange}
            className="p-4 w-full border-2 rounded-lg dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block mb-2 dark:text-gray-300">Marital Status</label>
          <select
            name="maritalStatus"
            disabled={!isEditing}
            value={formData.maritalStatus}
            onChange={handleChange}
            className="w-full border-2 rounded-lg p-4 dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="">-- Select Marital Status --</option>
            <option value="Married">Married</option>
            <option value="Single">Single</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="col-span-2">
          <label className="block mb-2 dark:text-gray-300">Address</label>
          <input
            type="text"
            name="address"
            disabled={!isEditing}
            value={formData.address}
            onChange={handleChange}
            className="p-4 w-full border-2 rounded-lg dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
            placeholder="Address"
          />
        </div>
        <div>
          <label className="block mb-2 dark:text-gray-300">Country</label>
          <select
            name="country"
            disabled={!isEditing}
            value={formData.country}
            onChange={handleChange}
            className="w-full border-2 rounded-lg p-4 dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="">-- Select Country --</option>
            <option value="Australia">Australia</option>
            <option value="Sri Lanka">Sri Lanka</option>
            <option value="Pakistan">Pakistan</option>
            <option value="India">India</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
