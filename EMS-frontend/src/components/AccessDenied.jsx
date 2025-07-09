import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaArrowLeft } from 'react-icons/fa';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center text-center">
          <div className="p-4 mb-4 text-red-600 bg-red-100 rounded-full">
            <FaLock className="w-12 h-12" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-800">Access Denied</h1>
          <p className="mb-6 text-gray-600">
            Sorry, you don't have permission to access this page. 
            Only administrators can access the settings area.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
