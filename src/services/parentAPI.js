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
      return {
        success: true,
        data: response.data.data.child,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create child',
        data: null
      };
    }
  },

  updateChild: async (childId, updateData) => {
    try {
      const response = await apiClient.put(`/children/${childId}`, updateData);
      return {
        success: true,
        data: response.data.data.child,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update child',
        data: null
      };
    }
  },

  getChildResults:  async (childId, params) => {
    try {
      const response = await apiClient.get(`/children/${childId}/results`, { params });
      return {
        success: true,
        data: response.data.data.results,
        childName: response.data.data.childName,
        pagination: {
          total: response.data.data.total,
          limit: response.data.data.limit,
          page: response.data.data.page,
          totalPage: response.data.data.pages,
        },
        error: null
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch child results',
        data: null
      };
    }
  }
};
  