import React, { useState, useEffect } from 'react'
import userService from '../services/userService'

const AddUserForm = ({buttonName, selectedObject, onSubmit, onClose}) => {
  const [formData, setFormData] = useState({
    eid: '',
    email: '',
    password: '',
    confirmPassword: '',
    urid: ''
  })
  const [userTypes, setUserTypes] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load user types
    loadUserTypes()
    
    // Set form data if editing
    if (selectedObject && selectedObject.eid) {
      setFormData({
        eid: selectedObject.eid || '',
        email: selectedObject.email || '',
        password: selectedObject.password || '',
        confirmPassword: selectedObject.password || '',
        urid: selectedObject.urid || ''
      })
    }
  }, [selectedObject])

  const loadUserTypes = async () => {
    try {
      const types = await userService.getUserTypes()
      setUserTypes(types)
    } catch (error) {
      console.error('Error loading user types:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.eid) newErrors.eid = 'Employee ID is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required'
    if (!formData.urid) newErrors.urid = 'User type is required'
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const userData = {
        eid: parseInt(formData.eid),
        email: formData.email,
        password: formData.password,
        urid: parseInt(formData.urid)
      }
      
      if (buttonName === 'Edit') {
        await userService.updateUser(formData.eid, userData)
      } else {
        await userService.createUser(userData)
      }
      
      onSubmit()
      onClose()
    } catch (error) {
      console.error('Error saving user:', error)
      setErrors({ submit: 'Error saving user. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      eid: '',
      email: '',
      password: '',
      confirmPassword: '',
      urid: ''
    })
    setErrors({})
  }

  return (
    <div>
         <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="eid" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Employee ID</label>
                        <input 
                          type="number" 
                          name="eid" 
                          id="eid" 
                          value={formData.eid}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                          placeholder="Employee Id" 
                          required 
                        />
                        {errors.eid && <p className="text-red-500 text-sm mt-1">{errors.eid}</p>}
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input 
                          type="email" 
                          name="email" 
                          id="email" 
                          value={formData.email}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                          placeholder="Employee Email" 
                          required 
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input 
                          type="password" 
                          name="password" 
                          id="password" 
                          value={formData.password}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                          required 
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                        <input 
                          type="password" 
                          name="confirmPassword" 
                          id="confirmPassword" 
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                          required 
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="urid" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User Type</label>
                        <select 
                          id="urid" 
                          name='urid' 
                          value={formData.urid}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          required
                        >
                            <option value="">--Select User Type--</option>
                            {userTypes.map(type => (
                              <option key={type.urid} value={type.urid}>{type.userType}</option>
                            ))}
                        </select>
                        {errors.urid && <p className="text-red-500 text-sm mt-1">{errors.urid}</p>}
                    </div>
                </div>
                
                {errors.submit && <p className="text-red-500 text-sm mb-4">{errors.submit}</p>}
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : buttonName}
                </button>
                <button 
                  type="button" 
                  onClick={handleReset}
                  className="ml-2 text-white inline-flex items-center bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                >
                    Clear
                </button>
            </form>
    </div>
  )
}

export default AddUserForm