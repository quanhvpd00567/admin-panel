import apiClient from '../config/apiClient.js';

/**
 * User API methods for CRUD operations
 */
export const parentAPI = {
  getChildren: async () => {
    try {
      const response = await apiClient.get('/children');
       return {
        success: true,
        data: response.data.data.children,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch children',
        data: null
      };
    }
  },

  addChild: async (childData) => {
    try {
      const response = await apiClient.post('/children', childData);
      return response.data;
    } catch (error) {
      console.error('Error adding child:', error);
      throw error;
    }
  }
};
  