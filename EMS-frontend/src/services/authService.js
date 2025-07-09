import apiClient from './apiClient';

// Login function
export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/login/', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userFullName');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

// Get user role
export const getUserRole = () => {
  return localStorage.getItem('userRole') || '';
};

// Get user info
export const getUserInfo = () => {
  return {
    id: localStorage.getItem('userId'),
    email: localStorage.getItem('userEmail'),
    role: localStorage.getItem('userRole'),
    fullName: localStorage.getItem('userFullName')
  };
};
