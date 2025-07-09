import React, { useState, useEffect }from 'react'
import { useOutletContext } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';


const Employees = () => {

  const { sidebarToggle } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modelDetails, setModelDetails] = useState({
      title: "",
      component: "",
      buttonName: "",
      objectName: "",
      objectID:""
    })

  // Fetch employees from API
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/employee_details/');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
        setError('');
      } else {
        setError('Failed to fetch employees');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleIsOpen = () =>{
    setIsOpen(!isOpen)
  }

  const handleDeleteModal = (emp) => {
    setModelDetails({
      title:"Delete the Employee", 
      component:"DeleteForm",
      objectName:"Employee",
      objectId: emp.eid
    })
    handleIsOpen()
  }

  // Filter data based on search term
  const filteredEmployee = searchTerm==="" ? employees : employees.filter(emp => 
        emp.eid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${sidebarToggle ? "ml-20": " ml-64 "}`}>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-black mt-8 mb-6 text-center border-b pb-2">
        Employee Details Management
      </h1>

      {/* Display error message */}
      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-800/10 dark:text-red-400 mx-4">
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
                         placeholder="Search employees by ID, name, department, or designation"
                   />
                  <Link to='/add-employee' className="ml-auto mr-6">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 ">
                      Add Employee
                    </button>
                 </Link>
                 <button 
                   onClick={fetchEmployees}
                   className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 ml-2"
                 >
                   Refresh
                 </button>
              </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="text-gray-600 dark:text-gray-400">Loading employees...</div>
            </div>
          ) : (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Employee ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Full Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Country
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Employee Type	
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Department
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Designation
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                   {filteredEmployee.length > 0 ? (
                          filteredEmployee.map(emp => (
                              <tr key={emp.eid} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{emp.eid}</td>
                                  <td className="px-6 py-4">{emp.fullname}</td>
                                  <td className="px-6 py-4">{emp.email}</td>
                                  <td className="px-6 py-4">{emp.country}</td>
                                  <td className="px-6 py-4">{emp.employeetype}</td>
                                  <td className="px-6 py-4">{emp.department}</td>
                                  <td className="px-6 py-4">{emp.designation}</td>
                                  <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                      emp.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' :
                                      emp.status === 'Inactive' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400' :
                                      emp.status === 'Suspended' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400' :
                                      'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'
                                    }`}>
                                      {emp.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                  <Link to={`/profile/${emp.eid}`} className="font-medium text-blue-600 dark:text-blue-500 hover:opacity-75 m-2">
                                    View Profile  
                                  </Link>
                                  <a href="#" onClick={ () => handleDeleteModal(emp)} className="font-medium text-red-600 dark:text-red-500 hover:opacity-75">
                                    Delete  
                                  </a>
                                  </td>
                              </tr>
                          ))
                      ) : (
                          <tr>
                              <td colSpan="9" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                {searchTerm ? 'No employees found matching your search.' : 'No employees found. Add some employees to get started.'}
                              </td>
                          </tr>
                    )}
                </tbody>
            </table>
          )}
      </div>
      {isOpen && <Modal sidebarToggle={sidebarToggle} handleIsOpen={handleIsOpen} modelDetails={modelDetails}/>}
    </div>
  )
}

export default Employees