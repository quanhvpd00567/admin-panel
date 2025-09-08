import apiClient from '../../config/apiClient.js';

const ENDPOINTS = {
  MAKE_QUIZ: (quizId) => `/quizzes/${quizId}/make`,
  GET_HISTORY: (quizId) => `/quizzes/${quizId}/history`,
}


export const makeQuizAPI = {
  async studentSubmissions(quizId, quizData) {
    try {
     const response = await apiClient.post(ENDPOINTS.MAKE_QUIZ(quizId), quizData);
      
      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data.history,
          message: response.data.data.message,
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

  async getHistory(historyId) {
    try {
     const response = await apiClient.get(ENDPOINTS.GET_HISTORY(historyId));
      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data.history,
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
};