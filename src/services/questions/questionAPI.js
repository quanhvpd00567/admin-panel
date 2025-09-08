/**
 * Question API Service
 * Handles all API calls related to questions
 */

import apiClient from '../../config/apiClient.js';

const ENDPOINTS = {
  QUESTIONS: '/questions',
  QUESTION_STATS: '/questions/stats',
  QUESTION_BULK: '/questions/bulk',
};

export const questionAPI = {
  /**
   * Get all questions with filtering and pagination
   */
  async getQuestions(params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.QUESTIONS, { params });
      
      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Failed to fetch questions',
        };
      }
    } catch (error) {
      console.error('Get questions error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error occurred',
      };
    }
  },

  /**
   * Get a single question by ID
   */
  async getQuestion(id) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.QUESTIONS}/${id}`);
      
      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data.question,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Failed to fetch question',
        };
      }
    } catch (error) {
      console.error('Get question error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error occurred',
      };
    }
  },

  /**
   * Create a new question
   */
  async createQuestion(questionData) {
    try {
      const response = await apiClient.post(ENDPOINTS.QUESTIONS, questionData);
      
      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Failed to create question',
          errors: response.data.errors || [],
        };
      }
    } catch (error) {
      console.error('Create question error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error occurred',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  /**
   * Update an existing question
   */
  async updateQuestion(id, questionData) {
    try {
      const response = await apiClient.put(`${ENDPOINTS.QUESTIONS}/${id}`, questionData);
      
      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Failed to update question',
          errors: response.data.errors || [],
        };
      }
    } catch (error) {
      console.error('Update question error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error occurred',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  /**
   * Delete a question (soft delete)
   */
  async deleteQuestion(id) {
    try {
      const response = await apiClient.delete(`${ENDPOINTS.QUESTIONS}/${id}`);
      
      if (response.data.status === 'success') {
        return {
          success: true,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Failed to delete question',
        };
      }
    } catch (error) {
      console.error('Delete question error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error occurred',
      };
    }
  },

  /**
   * Restore a deleted question
   */
  async restoreQuestion(id) {
    try {
      const response = await apiClient.patch(`${ENDPOINTS.QUESTIONS}/${id}/restore`);
      
      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Failed to restore question',
        };
      }
    } catch (error) {
      console.error('Restore question error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error occurred',
      };
    }
  },

  /**
   * Get question statistics
   */
  async getQuestionStats() {
    try {
      const response = await apiClient.get(ENDPOINTS.QUESTION_STATS);
      
      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data,
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Failed to fetch question stats',
        };
      }
    } catch (error) {
      console.error('Get question stats error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error occurred',
      };
    }
  },

  /**
   * Bulk operations on questions
   */
  async bulkUpdateQuestions(questionIds, operation, data = null) {
    try {
      const payload = {
        action: operation,
        questionIds: questionIds,
      };
      
      if (data) {
        payload.data = data;
      }
      
      const response = await apiClient.post(ENDPOINTS.QUESTION_BULK, payload);
      
      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Failed to perform bulk operation',
        };
      }
    } catch (error) {
      console.error('Bulk update questions error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error occurred',
      };
    }
  },
};

export default questionAPI;
