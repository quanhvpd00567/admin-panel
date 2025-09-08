/**
 * Subject Management API Service
 * Handles all subject-related API calls
 */

import apiClient from '../config/apiClient.js';

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      authAPI.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class SubjectAPI {
  /**
   * Get all subjects with pagination and filtering
   */
  async getSubjects(params = {}) {
    try {
      const response = await apiClient.get('subjects', { params });

      return {
        success: true,
        data: response.data.data,
        error: null
      };
    } catch (error) {
      console.error('Get subjects error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch subjects',
        data: null
      };
    }
  }

  /**
   * Get subject by ID
   */
  async getSubject(id) {
    try {
      const response = await apiClient.get(`subjects/${id}`);

      return {
        success: true,
        data: response.data.data,
        error: null
      };
    } catch (error) {
      console.error('Get subject error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch subject',
        data: null
      };
    }
  }

  /**
   * Create new subject
   */
  async createSubject(subjectData) {
    try {
      const response = await apiClient.post('subjects', subjectData);

      return {
        success: true,
        data: response.data.data,
        error: null
      };
    } catch (error) {
      console.error('Create subject error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create subject',
        errors: error.response?.data?.errors || null,
        data: null
      };
    }
  }

  /**
   * Update subject
   */
  async updateSubject(id, subjectData) {
    try {
      const response = await apiClient.put(`subjects/${id}`, subjectData);

      return {
        success: true,
        data: response.data.data,
        error: null
      };
    } catch (error) {
      console.error('Update subject error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update subject',
        errors: error.response?.data?.errors || null,
        data: null
      };
    }
  }

  /**
   * Delete subject (soft delete)
   */
  async deleteSubject(id) {
    try {
      const response = await apiClient.delete(`subjects/${id}`);

      return {
        success: true,
        data: response.data.data,
        error: null
      };
    } catch (error) {
      console.error('Delete subject error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete subject',
        data: null
      };
    }
  }

  /**
   * Restore subject
   */
  async restoreSubject(id) {
    try {
      const response = await apiClient.patch(`subjects/${id}/restore`);

      return {
        success: true,
        data: response.data.data,
        error: null
      };
    } catch (error) {
      console.error('Restore subject error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to restore subject',
        data: null
      };
    }
  }

  /**
   * Get subject statistics
   */
  async getSubjectStats() {
    try {
      const response = await apiClient.get('subjects/stats');

      return {
        success: true,
        data: response.data.data,
        error: null
      };
    } catch (error) {
      console.error('Get subject stats error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch subject statistics',
        data: null
      };
    }
  }

  /**
   * Get subjects list for dropdowns (simplified)
   */
  async getSubjectsList(isActive = true) {
    try {
      const response = await apiClient.get('subjects/list', {
        params: { isActive }
      });

      return {
        success: true,
        data: response.data.data.subjects,
        error: null
      };
    } catch (error) {
      console.error('Get subjects list error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch subjects list',
        data: null
      };
    }
  }

  /**
   * Get subjects by class/grade level
   */
  async getSubjectsByClass(classCode) {
    try {
      const response = await apiClient.get(`subjects/class/${classCode}`);

      return {
        success: true,
        data: response.data.data,
        error: null
      };
    } catch (error) {
      console.error('Get subjects by class error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch subjects by class',
        data: null
      };
    }
  }

  /**
   * Bulk operations for subjects
   */
  async bulkUpdateSubjects(subjectIds, updateData) {
    try {
      // Since backend doesn't have bulk update yet, we'll do individual updates
      const promises = subjectIds.map(id => this.updateSubject(id, updateData));
      const results = await Promise.allSettled(promises);
      
      const successful = results.filter(result => 
        result.status === 'fulfilled' && result.value.success
      ).length;

      return {
        success: successful > 0,
        data: {
          total: subjectIds.length,
          successful,
          failed: subjectIds.length - successful
        },
        error: successful === 0 ? 'All bulk operations failed' : null
      };
    } catch (error) {
      console.error('Bulk update subjects error:', error);
      return {
        success: false,
        error: error.message || 'Failed to bulk update subjects',
        data: null
      };
    }
  }

  async bulkDeleteSubjects(subjectIds) {
    try {
      const promises = subjectIds.map(id => this.deleteSubject(id));
      const results = await Promise.allSettled(promises);
      
      const successful = results.filter(result => 
        result.status === 'fulfilled' && result.value.success
      ).length;

      return {
        success: successful > 0,
        data: {
          total: subjectIds.length,
          successful,
          failed: subjectIds.length - successful
        },
        error: successful === 0 ? 'All bulk operations failed' : null
      };
    } catch (error) {
      console.error('Bulk delete subjects error:', error);
      return {
        success: false,
        error: error.message || 'Failed to bulk delete subjects',
        data: null
      };
    }
  }
}

export const subjectAPI = new SubjectAPI();
export default subjectAPI;
