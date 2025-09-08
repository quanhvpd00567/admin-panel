/**
 * Class API Service
 * Handles all class-related API operations
 */

import { API_BASE_URL } from '../constants/api';

const classAPI = {
  // Get all classes with optional filters
  getClasses: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const url = `${API_BASE_URL}/classes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      return {
        success: response.ok,
        data: data,
        error: response.ok ? null : data.message || 'Failed to fetch classes',
      };
    } catch (error) {
      console.error('Get classes error:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },

  // Get single class by ID
  getClass: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/classes/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      return {
        success: response.ok,
        data: data,
        error: response.ok ? null : data.message || 'Failed to fetch class',
      };
    } catch (error) {
      console.error('Get class error:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },

  // Create new class
  createClass: async (classData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(classData),
      });

      const data = await response.json();
      return {
        success: response.ok,
        data: data,
        error: response.ok ? null : data.message || 'Failed to create class',
        errors: data.errors || null,
      };
    } catch (error) {
      console.error('Create class error:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },

  // Update class
  updateClass: async (id, classData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/classes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(classData),
      });

      const data = await response.json();
      return {
        success: response.ok,
        data: data,
        error: response.ok ? null : data.message || 'Failed to update class',
        errors: data.errors || null,
      };
    } catch (error) {
      console.error('Update class error:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },

  // Delete class
  deleteClass: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/classes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      return {
        success: response.ok,
        data: data,
        error: response.ok ? null : data.message || 'Failed to delete class',
      };
    } catch (error) {
      console.error('Delete class error:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },

  // Bulk operations
  bulkUpdateClasses: async (classIds, updateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/classes/bulk`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          classIds,
          updateData,
        }),
      });

      const data = await response.json();
      return {
        success: response.ok,
        data: data,
        error: response.ok ? null : data.message || 'Failed to update classes',
      };
    } catch (error) {
      console.error('Bulk update classes error:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },

  bulkDeleteClasses: async (classIds) => {
    try {
      const response = await fetch(`${API_BASE_URL}/classes/bulk`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ classIds }),
      });

      const data = await response.json();
      return {
        success: response.ok,
        data: data,
        error: response.ok ? null : data.message || 'Failed to delete classes',
      };
    } catch (error) {
      console.error('Bulk delete classes error:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },

  // Get class statistics
  getClassStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/classes/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      return {
        success: response.ok,
        data: data,
        error: response.ok ? null : data.message || 'Failed to fetch class statistics',
      };
    } catch (error) {
      console.error('Get class stats error:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },
};

export { classAPI };
