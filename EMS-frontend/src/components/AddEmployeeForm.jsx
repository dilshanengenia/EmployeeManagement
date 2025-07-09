import React, { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom';

const AddEmployeeForm = () => {
  const { sidebarToggle } = useOutletContext();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    eid: '',
    fullname: '',
    initname: '',
    gender: '',
    dob: '',
    maritialstatus: '',
    address: '',
    country: '',
    designation: '',
    employeetype: '',
    department: '',
    status: 'Active',
    usertype: '',
    degree: '',
    university: '',
    educationlevel: '',
    startedyear: '',
    completedyear: '',
    educationstatus: '',
    email: '',
    emailtype: 'Official',
    phone: '',
    phonetype: '',
    image: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8000/employee_details/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('Employee added successfully!');
        // Reset form
        setFormData({
          eid: '',
          fullname: '',
          initname: '',
          gender: '',
          dob: '',
          maritialstatus: '',
          address: '',
          country: '',
          designation: '',
          employeetype: '',
          department: '',
          status: 'Active',
          usertype: '',
          degree: '',
          university: '',
          educationlevel: '',
          startedyear: '',
          completedyear: '',
          educationstatus: '',
          email: '',
          emailtype: 'Official',
          phone: '',
          phonetype: '',
          image: ''
        });
        
        // Navigate back after successful submission
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      eid: '',
      fullname: '',
      initname: '',
      gender: '',
      dob: '',
      maritialstatus: '',
      address: '',
      country: '',
      designation: '',
      employeetype: '',
      department: '',
      status: 'Active',
      usertype: '',
      degree: '',
      university: '',
      educationlevel: '',
      startedyear: '',
      completedyear: '',
      educationstatus: '',
      email: '',
      emailtype: 'Official',
      phone: '',
      phonetype: '',
      image: ''
    });
    setMessage('');
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className={`${sidebarToggle ? "ml-20": " ml-64 "} py-10 my-auto dark:bg-gray-900`}>
        <button type="button" onClick={goBack} className="m-2 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"> &larr; Go Back</button>
        <h1 className="text-3xl font-bold text-white mt-1 mb-6 text-center pb-2">
          Add New Employee
        </h1>

        <div className="lg:w-[80%] md:w-[90%] w-[96%] mx-auto flex gap-4">
            <div className="lg:w-[88%] sm:w-[88%] w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center dark:bg-gray-800/40">
                
                {/* Display message */}
                {message && (
                  <div className={`p-4 mb-4 text-sm rounded-lg ${
                    message.includes('Error') ? 'text-red-800 bg-red-50 dark:bg-red-800/10 dark:text-red-400' : 'text-green-800 bg-green-50 dark:bg-green-800/10 dark:text-green-400'
                  }`}>
                    {message}
                  </div>
                )}

                <form className="p-4 md:p-5 m-8" onSubmit={handleSubmit}>
                    {/**personal informations*/}
                    <p className="text-white text-center text-lg font-semibold tracking-wide py-2 border-b border-t border-gray-500 my-4">
                    --- Personal Information ---
                    </p>
                    <div className="grid gap-4 mb-4 grid-cols-2">
                        <div className="col-span-1 sm:col-span-1">
                            <label htmlFor="fullname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
                            <input 
                              type="text" 
                              name="fullname" 
                              id="fullname" 
                              value={formData.fullname}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                              placeholder="Type full name" 
                              required 
                            />
                        </div>
                        <div className="col-span-1 sm:col-span-1">
                            <label htmlFor="initname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name with Initials</label>
                            <input 
                              type="text" 
                              name="initname" 
                              id="initname" 
                              value={formData.initname}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                              placeholder="Type name with initials" 
                            />
                        </div>
                        <div className="col-span-1">
                            <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                            <input 
                              type="text" 
                              name="address" 
                              id="address" 
                              value={formData.address}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                              placeholder="Type address" 
                            />
                        </div>
                        <div className="sm:col-span-1">
                            <label htmlFor="country" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Country</label>
                            <select 
                              id="country" 
                              name="country" 
                              value={formData.country}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            >
                                <option value="">--Select Country--</option>
                                <option value="Australia">Australia</option>
                                <option value="Sri Lanka">Sri Lanka</option>
                                <option value="Pakistan">Pakistan</option>
                                <option value="India">India</option>
                                <option value="United States">United States</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Canada">Canada</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 col-span-4">
                        <div className="sm:col-span-1">
                            <label htmlFor="dob" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">DOB</label>
                            <input 
                              type="date" 
                              name="dob" 
                              id="dob" 
                              value={formData.dob}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                            />
                        </div>

                        <div className="sm:col-span-1">
                            <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gender</label>
                            <select 
                              id="gender" 
                              name="gender" 
                              value={formData.gender}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            >
                                <option value="">--Select Gender--</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="sm:col-span-1">
                            <label htmlFor="maritialstatus" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Marital Status</label>
                            <select 
                              id="maritialstatus" 
                              name="maritialstatus" 
                              value={formData.maritialstatus}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            >
                                <option value="">--Select Marital Status--</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                            </select>
                        </div>

                        <div className="sm:col-span-1">
                            <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image URL</label>
                            <input 
                              type="text" 
                              name="image" 
                              id="image" 
                              value={formData.image}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                              placeholder="Enter image URL"
                            />
                        </div>
                    </div>

                    {/**educational informations*/}
                    <p className="text-white text-center text-lg font-semibold tracking-wide py-2 border-b border-t border-gray-500 my-4">
                    --- Educational Qualifications  ---
                    </p>
                    <div className="grid gap-4 mb-4 mt-4 grid-cols-2">
                        <div className="sm:col-span-1">
                            <label htmlFor="degree" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Degree</label>
                            <input 
                              type="text" 
                              name="degree" 
                              id="degree" 
                              value={formData.degree}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                              placeholder="Type degree name" 
                            />
                        </div>
                        <div className="sm:col-span-1">
                            <label htmlFor="university" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">University</label>
                            <input 
                              type="text" 
                              name="university" 
                              id="university" 
                              value={formData.university}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                              placeholder="Type university name" 
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 mb-4 mt-4 grid-cols-4">
                        <div className="sm:col-span-1">
                            <label htmlFor="educationlevel" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Education Level</label>
                            <select 
                              id="educationlevel" 
                              name="educationlevel" 
                              value={formData.educationlevel}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            >
                                <option value="">--Select Education Level--</option>
                                <option value="High School">High School</option>
                                <option value="Associate Degree">Associate Degree</option>
                                <option value="Bachelor">Bachelor</option>
                                <option value="Masters">Masters</option>
                                <option value="Doctorate">Doctorate</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="sm:col-span-1">
                            <label htmlFor="educationstatus" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Education Status</label>
                            <select 
                              id="educationstatus" 
                              name="educationstatus" 
                              value={formData.educationstatus}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            >
                                <option value="">--Select Status--</option>
                                <option value="Completed">Completed</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Dropped">Dropped</option>
                            </select>
                        </div>
                        <div className="sm:col-span-1">
                            <label htmlFor="startedyear" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Started Year</label>
                            <input 
                              type="number" 
                              name="startedyear" 
                              id="startedyear" 
                              value={formData.startedyear}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                              placeholder="e.g., 2020" 
                              min="1900"
                              max="2030"
                            />
                        </div>
                        <div className="sm:col-span-1">
                            <label htmlFor="completedyear" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Completed Year</label>
                            <input 
                              type="number" 
                              name="completedyear" 
                              id="completedyear" 
                              value={formData.completedyear}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                              placeholder="e.g., 2024" 
                              min="1900"
                              max="2030"
                            />
                        </div>
                    </div>

                    {/**contact informations*/}
                    <p className="text-white text-center text-lg font-semibold tracking-wide py-2 border-b border-t border-gray-500 my-4">
                    --- Contact Information ---
                    </p>
                    <div className="grid gap-4 mb-4 mt-4 grid-cols-2">
                        <div className="sm:col-span-1">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input 
                              type="email" 
                              name="email" 
                              id="email" 
                              value={formData.email}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                              placeholder="Type email" 
                              required 
                            />
                        </div>
                        <div className="sm:col-span-1">
                            <label htmlFor="emailtype" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email Type</label>
                            <select 
                              id="emailtype" 
                              name="emailtype" 
                              value={formData.emailtype}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            >
                                <option value="Official">Official</option>
                                <option value="Personal">Personal</option>
                            </select>
                        </div>           
                    </div>

                    <div className="grid gap-4 mb-4 mt-4 grid-cols-2">      
                        <div className="sm:col-span-1">
                            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
                            <input 
                              type="text" 
                              name="phone" 
                              id="phone" 
                              value={formData.phone}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                              placeholder="Type phone number" 
                            />
                        </div>
                        <div className="sm:col-span-1">
                            <label htmlFor="phonetype" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Type</label>
                            <select 
                              id="phonetype" 
                              name="phonetype" 
                              value={formData.phonetype}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            >
                                <option value="">--Select Phone Type--</option>
                                <option value="Official">Official</option>
                                <option value="Personal">Personal</option>
                                <option value="Mobile">Mobile</option>
                                <option value="Home">Home</option>
                            </select>
                        </div> 
                    </div>
                    

                    {/**official informations*/}
                    <p className="text-white text-center text-lg font-semibold tracking-wide py-2 border-b border-t border-gray-500 my-4">
                    --- Official Information ---
                    </p>
                    <div className="grid gap-4 mb-4 mt-4 grid-cols-2">
                        <div className="col-span-1">
                            <label htmlFor="eid" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Employee ID</label>
                            <input 
                              type="text" 
                              name="eid" 
                              id="eid" 
                              value={formData.eid}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                              placeholder="Type employee ID" 
                              required 
                            />
                        </div>
                        <div className="col-span-1">
                            <label htmlFor="designation" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Designation</label>
                            <input 
                              type="text" 
                              name="designation" 
                              id="designation" 
                              value={formData.designation}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                              placeholder="Type designation" 
                              required 
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 mb-4 mt-4 grid-cols-4">
                        <div className="sm:col-span-1">
                            <label htmlFor="employeetype" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Employee Type</label>
                            <select 
                              id="employeetype" 
                              name="employeetype" 
                              value={formData.employeetype}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            >
                                <option value="">--Select Employee Type--</option>
                                <option value="Intern">Intern</option>
                                <option value="Permanent">Permanent</option>
                                <option value="Contract">Contract</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Part-time">Part-time</option>
                            </select>
                        </div>
                        <div className="sm:col-span-1">
                            <label htmlFor="department" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Department</label>
                            <select 
                              id="department" 
                              name="department" 
                              value={formData.department}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            >
                                <option value="">--Select Department--</option>
                                <option value="Data Science">Data Science</option>
                                <option value="Finance">Finance</option>
                                <option value="Sales & Marketing">Sales & Marketing</option>
                                <option value="Human Resources">Human Resources</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Operations">Operations</option>
                            </select>
                        </div>
                        <div className="sm:col-span-1">
                            <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                            <select 
                              id="status" 
                              name="status" 
                              value={formData.status}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Suspended">Suspended</option>
                                <option value="Terminated">Terminated</option>
                            </select>
                        </div>
                        <div className="sm:col-span-1">
                            <label htmlFor="usertype" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User Type</label>
                            <select 
                              id="usertype" 
                              name="usertype" 
                              value={formData.usertype}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            >
                                <option value="">--Select User Type--</option>
                                <option value="Admin">Admin</option>
                                <option value="HR">HR</option>
                                <option value="Manager">Manager</option>
                                <option value="Employee">Employee</option>
                            </select>
                        </div>
                    </div>


                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="mt-3 mr-2 text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Adding Employee...' : 'Add New Employee'}
                    </button>
                    <button 
                      type="button" 
                      onClick={handleReset}
                      className="mt-3 text-white inline-flex items-center bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                    >
                        Clear Form
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default AddEmployeeForm