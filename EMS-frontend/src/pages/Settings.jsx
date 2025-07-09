import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom';
import Modal from '../components/Modal';
import userService from '../services/userService';

const Settings = () => {

  const { sidebarToggle } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState({
      eid:"",
      email:"",
      password :"",
      urid:"",
      userType:""
    })
  const [modelDetails, setModelDetails] = useState({
      title: "",
      component: "",
      buttonName: "",
      objectName:"",
    objectID: ""
    })

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
      setError('');
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };
    
  const handleIsOpen = () =>{
      setIsOpen(!isOpen)
  }

  const handleAddModal = () => {
    setSelectedUser({
      eid:"",
      email:"",
      password :"",
      urid:"",
      userType:""
    })
    setModelDetails({
      title:"Add New User", 
      component:"AddUserForm",
      buttonName:"Add"
    })
    handleIsOpen()
  }

  const handleEditModal = (user) => {
    setSelectedUser(user)
    setModelDetails({
      title:"Update the User",
      component:"AddUserForm",
      buttonName:"Edit"
    })
    handleIsOpen()
  }

  const handleDeleteModal= async (user) => {
    if (window.confirm(`Are you sure you want to delete user: ${user.email}?`)) {
      try {
        await userService.deleteUser(user.eid);
        loadUsers(); // Refresh the list
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  }

  // Filter data based on search term
  const filteredUsers = searchTerm==="" ? users:users.filter(user => 
        user.eid.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${sidebarToggle ? "ml-20": " ml-64 "}`}>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-black mt-8 mb-6 text-center border-b pb-2">
        User Settings
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
                         placeholder="Search for users"
                   />
                 <button onClick={handleAddModal} className="ml-auto mr-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 ">
                  Add User
                 </button>
              </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Employee ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Password
                        </th>
                        <th scope="col" className="px-6 py-3">
                            User Role ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            User Type
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length > 0 ? (
                          filteredUsers.map(user => (
                              <tr key={user.eid} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{user.eid}</td>
                                  <td className="px-6 py-4">{user.email}</td>
                                  <td className="px-6 py-4">{'*'.repeat(user.password.length)}</td>
                                  <td className="px-6 py-4">{user.urid}</td>
                                  <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      user.userType === 'Admin' ? 'bg-red-100 text-red-800' :
                                      user.userType === 'HR' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {user.userType}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <button 
                                      onClick={() => handleEditModal(user)} 
                                      className="font-medium text-blue-600 dark:text-blue-500 hover:opacity-75 mr-3"
                                    >
                                      Edit
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteModal(user)} 
                                      className="font-medium text-red-600 dark:text-red-500 hover:opacity-75"
                                    >
                                      Delete
                                    </button>
                                  </td>
                              </tr>
                          ))
                      ) : (
                          <tr>
                              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                {loading ? 'Loading...' : 'No users found'}
                              </td>
                          </tr>
                    )}
                </tbody>
            </table>
          )}
      </div>
      {isOpen && <Modal sidebarToggle={sidebarToggle} handleIsOpen={handleIsOpen} modelDetails={modelDetails} selectedObject={selectedUser} onRefresh={loadUsers}/>}
    </div>
  )
}

export default Settings