import apiClient from './apiClient';

// User Management API Functions
export const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await apiClient.get('/users_management/');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (eid) => {
    try {
      const response = await apiClient.get(`/users_management/${eid}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const response = await apiClient.post('/users_management/', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (eid, userData) => {
    try {
      const response = await apiClient.put(`/users_management/${eid}/`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (eid) => {
    try {
      const response = await apiClient.delete(`/users_management/${eid}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Get user types
  getUserTypes: async () => {
    try {
      const response = await apiClient.get('/user_types/');
      return response.data;
    } catch (error) {
      console.error('Error fetching user types:', error);
      throw error;
    }
  }
};

export default userService;
