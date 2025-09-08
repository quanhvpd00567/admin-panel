import apiClient from '../../config/apiClient.js';

export const feedbackAPI = {
  // Submit feedback for a question
  submitQuestionFeedback: async (questionId, feedbackData) => {
    try {
      const response = await apiClient.post(`/feedback/questions/${questionId}`, feedbackData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error submitting question feedback:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to submit feedback'
      };
    }
  },

  // Get feedback for a question (admin only)
  getQuestionFeedback: async (questionId, params = {}) => {
    try {
      const response = await apiClient.get(`/feedback/questions/${questionId}`, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching question feedback:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch feedback'
      };
    }
  },

  // Get all feedback (admin only)
  getAllFeedback: async (params = {}) => {
    try {
      const response = await apiClient.get('/feedback', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching all feedback:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch feedback'
      };
    }
  },

  // Update feedback status (admin only)
  updateFeedbackStatus: async (feedbackId, status) => {
    try {
      const response = await apiClient.patch(`/feedback/${feedbackId}/status`, { status });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error updating feedback status:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update feedback status'
      };
    }
  },

  // Add admin response to feedback
  addFeedbackResponse: async (feedbackId, response) => {
    try {
      const result = await apiClient.patch(`/feedback/${feedbackId}/response`, { response });
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Error adding feedback response:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add response'
      };
    }
  }
};

export default feedbackAPI;
