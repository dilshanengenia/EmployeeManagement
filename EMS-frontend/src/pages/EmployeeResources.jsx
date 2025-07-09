import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaLaptop, FaCalendarAlt, FaCheckCircle, FaClock, FaBan, FaUser, FaBoxOpen } from 'react-icons/fa';
import apiClient from '../services/apiClient';
import { toast } from 'react-toastify';

const EmployeeResources = () => {
  const { sidebarToggle } = useOutletContext();
  const [resourceAllocations, setResourceAllocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchResourceAllocations();
    }
  }, [userId]);

  const fetchResourceAllocations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/employee_resource_allocations/${userId}/`);
      setResourceAllocations(response.data);
    } catch (error) {
      console.error('Error fetching resource allocations:', error);
      setError('Failed to load your resource allocations. Please try again later.');
      toast.error("Failed to load resource allocation information");
    } finally {
      setLoading(false);
    }
  };

  const getCollectionStatus = (collectedDate) => {
    if (collectedDate) {
      return {
        status: 'Collected',
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        icon: <FaCheckCircle className="text-green-500" />
      };
    } else {
      return {
        status: 'Not Collected',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        icon: <FaClock className="text-yellow-500" />
      };
    }
  };

  const calculateUsageDays = (collectedDate) => {
    if (!collectedDate) return 0;
    const collected = new Date(collectedDate);
    const today = new Date();
    const diffTime = Math.abs(today - collected);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  return (
    <div className={`${sidebarToggle ? "ml-20" : "ml-64"} p-6`}>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-black mt-4 mb-6 text-center border-b pb-2">
        My Resource Allocations
      </h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-600 dark:text-gray-400">Loading resource allocation information...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <>
          {/* Resource Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Resources</h3>
                  <p className="text-2xl font-bold text-blue-600">{resourceAllocations.length}</p>
                </div>
                <FaLaptop className="text-3xl text-blue-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Collected</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {resourceAllocations.filter(r => r.collecteddate).length}
                  </p>
                </div>
                <FaCheckCircle className="text-3xl text-green-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Not Collected</h3>
                  <p className="text-2xl font-bold text-yellow-600">
                    {resourceAllocations.filter(r => !r.collecteddate).length}
                  </p>
                </div>
                <FaBoxOpen className="text-3xl text-yellow-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Employee ID</h3>
                  <p className="text-2xl font-bold text-purple-600">{userId}</p>
                </div>
                <FaUser className="text-3xl text-purple-500" />
              </div>
            </div>
          </div>

          {/* Resource Allocations Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                <FaLaptop className="mr-2" />
                Resource Allocation Details
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                View all resources allocated to you and their collection status
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3">Allocation ID</th>
                    <th className="px-6 py-3">Employee ID</th>
                    <th className="px-6 py-3">Resource ID</th>
                    <th className="px-6 py-3">Allocated Date</th>
                    <th className="px-6 py-3">Collected Date</th>
                    <th className="px-6 py-3">Used Days</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {resourceAllocations.length > 0 ? (
                    resourceAllocations.map((allocation) => {
                      const collectionInfo = getCollectionStatus(allocation.collecteddate);
                      return (
                        <tr key={allocation.allocationid} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                            #{allocation.allocationid}
                          </td>
                          <td className="px-6 py-4">
                            {allocation.eid}
                          </td>
                          <td className="px-6 py-4 font-medium text-blue-600">
                            {allocation.rid || 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            {allocation.allocateddate ? new Date(allocation.allocateddate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            {allocation.collecteddate ? (
                              <div className="flex flex-col">
                                <span className="font-medium text-green-600">
                                  {new Date(allocation.collecteddate).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Collected on this date
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col">
                                <span className="font-medium text-yellow-600">Not Collected</span>
                                <span className="text-xs text-gray-500">
                                  Resource ready for collection
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {allocation.useddays !== null ? (
                              <span className="font-medium">{allocation.useddays} days</span>
                            ) : allocation.collecteddate ? (
                              <span className="text-sm text-gray-500">
                                {calculateUsageDays(allocation.collecteddate)} days (auto-calculated)
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {collectionInfo.icon}
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${collectionInfo.color}`}>
                                {collectionInfo.status}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center">
                          <FaBoxOpen className="text-4xl text-gray-300 mb-2" />
                          <p>No resources have been allocated to you yet.</p>
                          <p className="text-xs mt-1">Contact your administrator if you believe this is an error.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Information Panel */}
            {resourceAllocations.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      📋 What you have in hand:
                    </h4>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                      {resourceAllocations.filter(r => r.collecteddate).map(allocation => (
                        <li key={allocation.allocationid} className="flex items-center">
                          <FaCheckCircle className="text-green-500 mr-2 text-xs" />
                          Resource {allocation.rid} - Collected on {new Date(allocation.collecteddate).toLocaleDateString()}
                        </li>
                      ))}
                      {resourceAllocations.filter(r => r.collecteddate).length === 0 && (
                        <li className="text-gray-500 italic">No resources collected yet</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      📦 Pending Collection:
                    </h4>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                      {resourceAllocations.filter(r => !r.collecteddate).map(allocation => (
                        <li key={allocation.allocationid} className="flex items-center">
                          <FaClock className="text-yellow-500 mr-2 text-xs" />
                          Resource {allocation.rid} - Allocated on {new Date(allocation.allocateddate).toLocaleDateString()}
                        </li>
                      ))}
                      {resourceAllocations.filter(r => !r.collecteddate).length === 0 && (
                        <li className="text-gray-500 italic">All resources have been collected</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeResources;
