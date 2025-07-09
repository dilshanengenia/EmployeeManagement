import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

const ErrorBoundary = () => {
  const error = useRouteError();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.598 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Oops! Something went wrong
          </h1>
          
          <div className="mb-6">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              {error?.status === 404 ? (
                "The page you're looking for doesn't exist."
              ) : (
                "We encountered an unexpected error."
              )}
            </p>
            
            {error?.statusText && (
              <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded p-2 font-mono">
                {error.status} - {error.statusText}
              </p>
            )}
            
            {error?.data && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200">
                  Error Details
                </summary>
                <pre className="mt-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded p-2 overflow-auto max-h-32">
                  {typeof error.data === 'string' ? error.data : JSON.stringify(error.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Go Back
            </button>
            
            <Link 
              to="/"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return Home
            </Link>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              If this problem persists, please contact the system administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
