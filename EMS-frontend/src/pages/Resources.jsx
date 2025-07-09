import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const Resources = () => {
  const { sidebarToggle } = useOutletContext();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const [formData, setFormData] = useState({
    eid: '',
    rid: '',
    allocateddate: '',
    collecteddate: '',
  });

  // Fetch resource allocations when component mounts
  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/resource_allocations/');
      setResources(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load resources. Please try again later.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/resource_allocations/', formData);
      setShowAddModal(false);
      setFormData({
        eid: '',
        rid: '',
        allocateddate: '',
        collecteddate: '',
      });
      fetchResources();
    } catch (err) {
      console.error('Error adding resource:', err);
      setError('Failed to add resource. Please try again.');
    }
  };

  const handleEditResource = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/resource_allocations/${currentResource.allocationid}/`, formData);
      setShowEditModal(false);
      fetchResources();
    } catch (err) {
      console.error('Error updating resource:', err);
      setError('Failed to update resource. Please try again.');
    }
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource allocation?')) {
      try {
        await apiClient.delete(`/resource_allocations/${id}/`);
        fetchResources();
      } catch (err) {
        console.error('Error deleting resource:', err);
        setError('Failed to delete resource. Please try again.');
      }
    }
  };

  const openEditModal = (resource) => {
    setCurrentResource(resource);
    setFormData({
      eid: resource.eid,
      rid: resource.rid,
      allocateddate: resource.allocateddate,
      collecteddate: resource.collecteddate || '',
    });
    setShowEditModal(true);
  };

  return (
    <div className={`${sidebarToggle ? "ml-20": " ml-64 "} p-4`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-black">
          Resources Allocation
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          <FaPlus className="mr-2" /> Add Resource
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading resources...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-left">ID</th>
                <th className="py-3 px-4 border-b text-left">Employee ID</th>
                <th className="py-3 px-4 border-b text-left">Employee Name</th>
                <th className="py-3 px-4 border-b text-left">Resource ID</th>
                <th className="py-3 px-4 border-b text-left">Allocated Date</th>
                <th className="py-3 px-4 border-b text-left">Collected Date</th>
                <th className="py-3 px-4 border-b text-left">Used Days</th>
                <th className="py-3 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-6 text-center text-gray-500">
                    No resources found
                  </td>
                </tr>
              ) : (
                resources.map((resource) => (
                  <tr key={resource.allocationid} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{resource.allocationid}</td>
                    <td className="py-3 px-4 border-b">{resource.eid}</td>
                    <td className="py-3 px-4 border-b">{resource.employee_name}</td>
                    <td className="py-3 px-4 border-b">{resource.rid}</td>
                    <td className="py-3 px-4 border-b">{resource.allocateddate}</td>
                    <td className="py-3 px-4 border-b">{resource.collecteddate || 'Not collected'}</td>
                    <td className="py-3 px-4 border-b">{resource.useddays || 'N/A'}</td>
                    <td className="py-3 px-4 border-b">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(resource)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteResource(resource.allocationid)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add Resource Allocation</h2>
            <form onSubmit={handleAddResource}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Employee ID</label>
                <input
                  type="text"
                  name="eid"
                  value={formData.eid}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Resource ID</label>
                <input
                  type="text"
                  name="rid"
                  value={formData.rid}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Allocated Date</label>
                <input
                  type="date"
                  name="allocateddate"
                  value={formData.allocateddate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Collected Date</label>
                <input
                  type="date"
                  name="collecteddate"
                  value={formData.collecteddate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  Add Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Resource Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit Resource Allocation</h2>
            <form onSubmit={handleEditResource}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Employee ID</label>
                <input
                  type="text"
                  name="eid"
                  value={formData.eid}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Resource ID</label>
                <input
                  type="text"
                  name="rid"
                  value={formData.rid}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Allocated Date</label>
                <input
                  type="date"
                  name="allocateddate"
                  value={formData.allocateddate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Collected Date</label>
                <input
                  type="date"
                  name="collecteddate"
                  value={formData.collecteddate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  Update Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources