/**
 * Quiz API Service
 * Handles all API calls related to quizzes
 */

import apiClient from '../../config/apiClient.js';

const ENDPOINTS = {
  AI_GENERATE_PROCESS: '/ai/generate-process',
};

export const aiAPI = {
  async listAIGeneratedQuizzes(params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.AI_GENERATE_PROCESS, { params });
      
      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data,
          pagination: response.data.pagination,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Failed to fetch quizzes',
        };
      }
    } catch (error) {
      console.error('Get quizzes error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error occurred',
      };
    }
  },

}


export default aiAPI;
