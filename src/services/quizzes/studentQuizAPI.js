import apiClient from '../../config/apiClient.js';

const ENDPOINTS = {
  QUIZZES: (studentId) => `/students/${studentId}/quizzes`,
  QUIZZ: (studentId) => `/students/quizzes/${studentId}/show`,
  UPDATE_STATUS_START: (studentQuizId) => `/students/quizzes/${studentQuizId}/start`,
};

export const studentQuizAPI = {
  getStudentQuizzes: async (studentId) => {
    try {
      const response = await apiClient.get(ENDPOINTS.QUIZZES(studentId));

      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data,
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

  updateStatus: async (studentQuizId) => {
    try {
      const response = await apiClient.post(ENDPOINTS.UPDATE_STATUS_START(studentQuizId));
      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.history,
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

    /**
   * Get a single quiz by ID
   */
  async getStudentQuiz(studentId) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.QUIZZ(studentId)}`);

      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data.quiz,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Quiz not found',
        };
      }
    } catch (error) {
      console.error('Get quiz error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error occurred',
      };
    }
  },
}