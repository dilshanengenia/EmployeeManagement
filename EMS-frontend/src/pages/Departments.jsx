import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom';
import Modal from '../components/Modal';
import apiClient from '../services/apiClient';

const Departments = () => {

  const { sidebarToggle } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState({
    dno:"",
    dname:"",
    noofemp :"",
    dlocation:""
  })
  const [modelDetails, setModelDetails] = useState({
    title: "",
    component: "",
    buttonName: "",
    objectName:""
  })

  // Fetch departments from API
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/departments/');
      setDepartments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch departments');
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleIsOpen = () =>{
    setIsOpen(!isOpen)
  }

  const handleAddModal = () => {
    setSelectedDepartment({
      dno:"",
      dname:"",
      noofemp :"",
      dlocation:""
    })
    setModelDetails({
      title:"Add New Department", 
      component:"AddDepartmentForm",
      buttonName:"Add"
    })
    handleIsOpen()
  }

  const handleEditModal = (dept) => {
    setSelectedDepartment(dept)
    setModelDetails({
      title:"Update the Department",
      component:"AddDepartmentForm",
      buttonName:"Edit"
    })
    handleIsOpen()
  }

  const handleDeleteModal = (dept) => {
    setModelDetails({
      title:"Delete the Department", 
      component:"DeleteForm",
      objectName:"Department",
      objectId:dept.dno
    })
    handleIsOpen()
  }

  // Handle successful operations (add/edit/delete)
  const handleOperationSuccess = () => {
    fetchDepartments(); // Refresh the departments list
    setIsOpen(false);
  };

  // Filter data based on search term
  const filteredDepartments = searchTerm==="" ? departments : departments.filter(dept => 
        (dept.dno || dept.department_number || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dept.dlocation || dept.department_location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dept.dname || dept.department_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${sidebarToggle ? "ml-20": " ml-64 "}`}> 
          <h1 className="text-3xl font-bold text-gray-800 dark:text-black mt-8 mb-6 text-center border-b pb-2">
            Departments
          </h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-3">
          <div className="pb-4 bg-white dark:bg-gray-900 pt-3">
              <label htmlFor="table-search" className="sr-only">Search</label>
              <div className="relative flex items-center  mt-2 ml-4">  
                  <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                      </svg>
                  </div>
                  <input type="text" id="table-search" 
                         className="block pt-2 pb-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         placeholder="Search for items"
                   />

                 <button onClick={handleAddModal} className="ml-auto mr-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 ">
                  Add Department
                 </button>
              </div>
          </div>
          
          {loading ? (
            <div className="text-center py-4">Loading departments...</div>
          ) : (
          <table id='departments-table' className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" className="px-6 py-3">
                          Department Number
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Department Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Number of Employees
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Department Location
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Action
                      </th>
                  </tr>
              </thead>
              <tbody>
                {filteredDepartments.length > 0 ? (
                        filteredDepartments.map(dept => (
                            <tr key={dept.dno || dept.department_number} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4">{dept.dno || dept.department_number}</td>
                                <td className="px-6 py-4">{dept.dname || dept.department_name}</td>
                                <td className="px-6 py-4">{dept.noofemp || dept.number_of_employees || 0}</td>
                                <td className="px-6 py-4">{dept.dlocation || dept.department_location}</td>
                                <td className="px-6 py-4">
                                  <button onClick={() => handleEditModal(dept)} className="font-medium text-blue-600 dark:text-blue-500 hover:opacity-75 mr-4">Edit</button>
                                  <button onClick={() => handleDeleteModal(dept)} className="font-medium text-red-600 dark:text-red-500 hover:opacity-75">Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="px-6 py-4 text-center">No departments found</td>
                        </tr>
                    )}
              </tbody>
          </table>
          )}
      </div>

      {isOpen && <Modal sidebarToggle={sidebarToggle} handleIsOpen={handleIsOpen} modelDetails={modelDetails} selectedObject={selectedDepartment} onSuccess={handleOperationSuccess}/>}

    </div>
  )
}

export default Departments