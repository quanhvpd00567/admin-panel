/**
 * Quiz API Service
 * Handles all API calls related to quizzes
 */

import apiClient from '../../config/apiClient.js';

const ENDPOINTS = {
  QUIZZES: '/quizzes',
  QUIZ_STATS: '/quizzes/stats',
  QUIZ_LIST: '/quizzes/list',
  QUIZ_QUESTIONS: (id) => `/quizzes/${id}/questions`,
  QUIZ_SUBMIT: '/quizzes/submit',
  QUIZ_RESULT: (attemptId) => `/quizzes/results/${attemptId}`,
  QUIZ_DOWNLOAD: (attemptId) => `/quizzes/results/${attemptId}/download`,
};

export const quizAPI = {
  /**
   * Get all quizzes with filtering and pagination
   */
  async getQuizzes(params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.QUIZZES, { params });
      
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

  /**
   * Get a single quiz by ID
   */
  async getQuiz(id) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.QUIZZES}/${id}`);
      
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

  /**
   * Create a new quiz
   */
  async createQuiz(quizData) {
    try {
      const response = await apiClient.post(ENDPOINTS.QUIZZES, quizData);
      
      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data.quiz,
          message: response.data.message || 'Quiz created successfully',
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Failed to create quiz',
        };
      }
    } catch (error) {
      console.error('Create quiz error:', error);
      if (error.response?.status === 422) {
        return {
          success: false,
          error: 'Validation failed',
          validationErrors: error.response.data.errors,
        };
      }
      return {
        success: false,
        error: error.response?.data?.message || 'Network error occurred',
      };
    }
  },

  /**
   * Update an existing quiz
   */
  async updateQuiz(id, quizData) {
    try {
      const response = await apiClient.put(`${ENDPOINTS.QUIZZES}/${id}`, quizData);
      
      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data.quiz,
          message: response.data.message || 'Quiz updated successfully',
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Failed to update quiz',
        };
      }
    } catch (error) {
      console.error('Update quiz error:', error);
      if (error.response?.status === 422) {
        return {
          success: false,
          error: 'Validation failed',
          validationErrors: error.response.data.errors,
        };
      }
      return {
        success: false,
        error: error.response?.data?.message || 'Network error occurred',
      };
    }
  },

  /**
   * Delete a quiz (soft delete)
   */
  async deleteQuiz(id) {
    try {
      const response = await apiClient.delete(`${ENDPOINTS.QUIZZES}/${id}`);
      
      if (response.data.status === 'success') {
        return {
          success: true,
          message: response.data.message || 'Quiz deleted successfully',
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Failed to delete quiz',
        };
      }
    } catch (error) {
      console.error('Delete quiz error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error occurred',
      };
    }
  },

  /**
   * Restore a deleted quiz
   */
  async restoreQuiz(id) {
    try {
      const response = await apiClient.patch(`${ENDPOINTS.QUIZZES}/${id}/restore`);
      
      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data.quiz,
          message: response.data.message || 'Quiz restored successfully',
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Failed to restore quiz',
        };
      }
    } catch (error) {
      console.error('Restore quiz error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error occurred',
      };
    }
  },

  /**
   * Get quiz statistics
   */
  async getQuizStats() {
    try {
      const response = await apiClient.get(ENDPOINTS.QUIZ_STATS);
      
      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Failed to fetch quiz statistics',
        };
      }
    } catch (error) {
      console.error('Get quiz stats error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error occurred',
      };
    }
  },

  /**
   * Get quiz list for dropdowns
   */
  async getQuizList(params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.QUIZ_LIST, { params });
      
      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Failed to fetch quiz list',
        };
      }
    } catch (error) {
      console.error('Get quiz list error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error occurred',
      };
    }
  },

  /**
   * Add a question to a quiz
   */
  async addQuestionToQuiz(quizId, questionData) {
    try {
      const response = await apiClient.post(ENDPOINTS.QUIZ_QUESTIONS(quizId), questionData);
      
      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data.quiz,
          message: response.data.message || 'Question added to quiz successfully',
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Failed to add question to quiz',
        };
      }
    } catch (error) {
      console.error('Add question to quiz error:', error);
      if (error.response?.status === 422) {
        return {
          success: false,
          error: 'Validation failed',
          validationErrors: error.response.data.errors,
        };
      }
      return {
        success: false,
        error: error.response?.data?.message || 'Network error occurred',
      };
    }
  },

  /**
   * Bulk operations on quizzes
   */
  async bulkOperation(action, quizIds, data = null) {
    try {
      const payload = {
        action,
        quizIds,
        ...(data && { data }),
      };

      const response = await apiClient.post(ENDPOINTS.QUIZ_BULK, payload);
      
      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || `Bulk ${action} completed successfully`,
        };
      } else {
        return {
          success: false,
          error: response.data.message || `Failed to perform bulk ${action}`,
        };
      }
    } catch (error) {
      console.error('Bulk operation error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error occurred',
      };
    }
  },

  /**
   * Submit quiz answers
   */
  async submitQuiz(submissionData) {
    try {
      const response = await apiClient.post(ENDPOINTS.QUIZ_SUBMIT, submissionData);
      
      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Failed to submit quiz',
        };
      }
    } catch (error) {
      console.error('Submit quiz error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error occurred',
      };
    }
  },

  /**
   * Get quiz result by attempt ID
   */
  async getQuizResult(attemptId) {
    try {
      const response = await apiClient.get(ENDPOINTS.QUIZ_RESULT(attemptId));
      
      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Failed to fetch quiz result',
        };
      }
    } catch (error) {
      console.error('Get quiz result error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error occurred',
      };
    }
  },

  /**
   * Download quiz result as PDF
   */
  async downloadResult(attemptId) {
    try {
      const response = await apiClient.get(ENDPOINTS.QUIZ_DOWNLOAD(attemptId), {
        responseType: 'blob',
      });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Download result error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error occurred',
      };
    }
  },

  /**
   * Assign quiz to student
   */
  async assignQuiz(quizId, studentId) {
    try {
      const response = await apiClient.post(`${ENDPOINTS.QUIZZES}/${quizId}/assign`, { studentId });
      if (response.data.status === 'success') {
        return {
          success: true,
          message: response.data.message || 'Giao bài kiểm tra thành công',
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Giao bài kiểm tra thất bại',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Có lỗi xảy ra khi giao bài kiểm tra',
      };
    }
  },

  /** * Generate quiz using AI */
  async generateQuizAI(quizParams) {
    try {
      const response = await apiClient.post('/quizzes/generate_ai', quizParams);
      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data.quiz,
          message: response.data.message || 'Quiz generated successfully',
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Failed to generate quiz',
        };
      }
    } catch (error) {
      console.error('Generate quiz AI error:', error);
      if (error.response?.status === 422) {
        return {
          success: false,
          error: 'Validation failed',
          validationErrors: error.response.data.errors,
        };
      }
      return {
        success: false,
        error: error.response?.data?.message || 'Network error occurred',
      };
    }
  }
};



// Constants for quiz management
export const QUIZ_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published', 
  ARCHIVED: 'archived',
};

export const QUIZ_DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

export const QUIZ_TYPES = {
  PRACTICE: 'practice',
  EXAM: 'exam',
  ASSIGNMENT: 'assignment',
  SURVEY: 'survey',
};

export default quizAPI;
