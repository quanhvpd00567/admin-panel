/**
 * User Management API Service
 * Integrates with Learning Management Backend User CRUD API
 */

import apiClient from '../config/apiClient.js';

/**
 * User API methods for CRUD operations
 */
export const userAPI = {
  /**
   * Get all users with pagination and filtering
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @param {string} params.role - Filter by role (administrator, parent, student)
   * @param {string} params.search - Search by name or email
   * @param {boolean} params.isActive - Filter by active status
   * @returns {Promise<Object>} Users list with pagination
   */
  async getUsers(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add filters
      if (params.role) queryParams.append('role', params.role);
      if (params.search) queryParams.append('search', params.search);
      if (params.isActive !== undefined) queryParams.append('isActive', params.isActive);

      const response = await apiClient.get(`/users?${queryParams.toString()}`);
      
      const { data } = response.data;
      
      return {
        success: true,
        data: {
          users: data.users,
          pagination: data.pagination,
        },
      };
    } catch (error) {
      console.error('Get users error:', error);
      
      const errorMessage = error.response?.data?.message || 'Failed to fetch users';
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Get single user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getUser(userId) {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      
      const { data } = response.data;
      
      return {
        success: true,
        data: {
          user: {
            id: data.user.id,
            email: data.user.email,
            username: data.user.username,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            fullName: data.user.fullName,
            bio: data.user.bio,
            role: data.user.role,
            isActive: data.user.isActive,
            isEmailVerified: data.user.isEmailVerified,
            loginAttempts: data.user.loginAttempts,
            lastLoginAt: data.user.lastLoginAt,
            preferences: data.user.preferences,
            metadata: data.user.metadata,
            createdAt: data.user.createdAt,
            updatedAt: data.user.updatedAt,
          },
        },
      };
    } catch (error) {
      console.error('Get user error:', error);
      
      const errorMessage = error.response?.data?.message || 'Failed to fetch user';
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Create new user
   * @param {Object} userData - User data
   * @param {string} userData.email - User email
   * @param {string} userData.username - Username
   * @param {string} userData.password - User password
   * @param {string} userData.firstName - First name
   * @param {string} userData.lastName - Last name
   * @param {string} userData.role - User role (administrator, parent, student)
   * @param {string} userData.bio - User bio (optional)
   * @param {boolean} userData.isEmailVerified - Email verification status (optional)
   * @returns {Promise<Object>} Created user data
   */
  async createUser(userData) {
    try {
      // Map frontend data to backend API format
      const backendData = {
        email: userData.email,
        username: userData.username || userData.email.split('@')[0],
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: this.mapRoleToBackend(userData.role),
        bio: userData.bio || '',
        isEmailVerified: userData.isEmailVerified || false,
      };

      const response = await apiClient.post('/users', backendData);
      
      const { data } = response.data;
      
      return {
        success: true,
        data: {
          user: {
            id: data.user.id,
            email: data.user.email,
            username: data.user.username,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            fullName: data.user.fullName,
            bio: data.user.bio,
            role: data.user.role,
            isActive: data.user.isActive,
            isEmailVerified: data.user.isEmailVerified,
            createdAt: data.user.createdAt,
            updatedAt: data.user.updatedAt,
          },
        },
      };
    } catch (error) {
      console.error('Create user error:', error);
      
      let errorMessage = 'Failed to create user';
      
      if (error.response?.data?.errors) {
        // Handle validation errors
        errorMessage = error.response.data.errors.join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Update user
   * @param {string} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user data
   */
  async updateUser(userId, userData) {
    try {
      // Map frontend data to backend API format
      const backendData = {
        ...(userData.firstName && { firstName: userData.firstName }),
        ...(userData.lastName && { lastName: userData.lastName }),
        ...(userData.bio !== undefined && { bio: userData.bio }),
        ...(userData.isEmailVerified !== undefined && { isEmailVerified: userData.isEmailVerified }),
        ...(userData.isActive !== undefined && { isActive: userData.isActive }),
        ...(userData.role && { role: this.mapRoleToBackend(userData.role) }),
        ...(userData.preferences && { preferences: userData.preferences }),
      };

      const response = await apiClient.put(`/users/${userId}`, backendData);
      
      const { data } = response.data;
      
      return {
        success: true,
        data: {
          user: {
            id: data.user.id,
            email: data.user.email,
            username: data.user.username,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            fullName: data.user.fullName,
            bio: data.user.bio,
            role: data.user.role,
            isActive: data.user.isActive,
            isEmailVerified: data.user.isEmailVerified,
            preferences: data.user.preferences,
            createdAt: data.user.createdAt,
            updatedAt: data.user.updatedAt,
          },
        },
      };
    } catch (error) {
      console.error('Update user error:', error);
      
      let errorMessage = 'Failed to update user';
      
      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Delete user (soft delete - deactivate)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteUser(userId) {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      
      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      console.error('Delete user error:', error);
      
      const errorMessage = error.response?.data?.message || 'Failed to delete user';
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Restore user (reactivate)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Restore response
   */
  async restoreUser(userId) {
    try {
      const response = await apiClient.patch(`/users/${userId}/restore`);
      
      const { data } = response.data;
      
      return {
        success: true,
        data: {
          user: {
            id: data.user.id,
            email: data.user.email,
            username: data.user.username,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            fullName: data.user.fullName,
            bio: data.user.bio,
            role: data.user.role,
            isActive: data.user.isActive,
            isEmailVerified: data.user.isEmailVerified,
            createdAt: data.user.createdAt,
            updatedAt: data.user.updatedAt,
          },
        },
        message: 'User restored successfully',
      };
    } catch (error) {
      console.error('Restore user error:', error);
      
      const errorMessage = error.response?.data?.message || 'Failed to restore user';
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Get user statistics
   * @returns {Promise<Object>} User statistics
   */
  async getUserStats() {
    try {
      const response = await apiClient.get('/users/stats');
      
      const { data } = response.data;
      
      return {
        success: true,
        data: {
          total: data.total,
          active: data.active,
          inactive: data.inactive,
          roles: data.roles,
          emailVerification: data.emailVerification,
        },
      };
    } catch (error) {
      console.error('Get user stats error:', error);
      
      const errorMessage = error.response?.data?.message || 'Failed to fetch user statistics';
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Map frontend role values to backend role values
   * @param {string|number} frontendRole - Frontend role value
   * @returns {string} Backend role value
   */
  mapRoleToBackend(frontendRole) {
    // Handle both string and numeric role values
    const roleMap = {
      // String mappings
      'admin': 'administrator',
      'administrator': 'administrator',
      'parent': 'parent',
      'student': 'student',
      'user': 'student', // Default user becomes student
      
      // Numeric mappings (from CreateUserModal)
      1: 'administrator',
      2: 'parent',
      3: 'student',
      '1': 'administrator',
      '2': 'parent',
      '3': 'student',
    };

    return roleMap[frontendRole] || 'student';
  },

  /**
   * Map backend role values to frontend role values for display
   * @param {string} backendRole - Backend role value
   * @returns {string} Frontend role value
   */
  mapRoleToFrontend(backendRole) {
    const roleMap = {
      'administrator': 'Admin',
      'parent': 'Parent',
      'student': 'Student',
    };

    return roleMap[backendRole] || 'Student';
  },
};

// Export user roles for forms and validation
export const userRoles = [
  { value: 'administrator', label: 'Administrator' },
  { value: 'parent', label: 'Parent' },
  { value: 'student', label: 'Student' },
];

// Export user statuses for forms
export const userStatuses = [
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
];

// Default export
export default userAPI;
