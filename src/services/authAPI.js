/**
 * Real Authentication API Service
 * Integrates with Learning Management Backend API
 */

import axios from 'axios';
import authApiClient from '../config/authApiClient.js';
import { ENV } from '../config/env.js';

// Debug: Log environment configuration
console.log('🔧 AuthAPI Environment Config:', {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  mode: import.meta.env.MODE,
});

/**
 * Authentication API methods
 */
export const authAPI = {
  /**
   * Admin login
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login response with user data and token
   */
  async login(email, password) {
    try {
      const response = await authApiClient.post('/auth/admin/login', {
        email,
        password,
      });

      console.log('Login response:', response.data);
      const { data } = response.data;
      
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('blog_admin_token', data.token.token);
        // Set token for future requests
        authApiClient.defaults.headers.common.Authorization = `Bearer ${data.token.token}`;
      }

      console.log('Login successful:', {
        userId: data.user.id,
        userEmail: data.user.email,
      });

      return {
        success: true,
        data: {
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
            lastLoginAt: data.user.lastLoginAt,
          },
          token: data.token.token,
          expiresAt: data.token.expiresAt,
        },
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Admin logout
   * @returns {Promise<Object>} Logout response
   */
  async logout() {
    try {
      await authApiClient.post('/auth/admin/logout');
      
      // Clear local storage
      localStorage.removeItem('blog_admin_token');
      localStorage.removeItem('blog_admin_refresh');
      
      // Remove auth header
      delete authApiClient.defaults.headers.common.Authorization;

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      // Even if logout fails on server, clear local storage
      localStorage.removeItem('blog_admin_token');
      localStorage.removeItem('blog_admin_refresh');
      delete authApiClient.defaults.headers.common.Authorization;
      return {
        success: true,
        message: 'Logged out successfully',
      };
    }
  },

  /**
   * Get current user info
   * @returns {Promise<Object>} Current user data
   */
  async getCurrentUser() {
    try {
      const response = await authApiClient.get('/auth/admin/me');
      
      const { data } = response.data;

      return {
        success: true,
        data: {
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
            isActive: data.user.isActive,
            isEmailVerified: data.user.isEmailVerified,
            lastLoginAt: data.user.lastLoginAt,
            preferences: data.user.preferences,
            createdAt: data.user.createdAt,
            updatedAt: data.user.updatedAt,
          },
        },
      };
    } catch (error) {
      console.error('Get current user error:', error);
      
      const errorMessage = error.response?.data?.message || 'Failed to get user data';
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Validate token
   * @param {string} token - JWT token to validate
   * @returns {Promise<Object>} Token validation result
   */
  async validateToken(token) {
    try {
      // Set token for the request
      const tempClient = axios.create({
        baseURL: ENV.API_BASE_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await tempClient.get('/auth/admin/me');
      
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid token',
      };
    }
  },

  /**
   * Check if user has specific role
   * @param {string} requiredRole - Required role to check
   * @param {string} userRole - Current user role
   * @returns {boolean} Whether user has required role
   */
  hasRole(requiredRole, userRole) {
    // Map backend roles to frontend roles
    const roleMap = {
      administrator: 'ADMIN',
      parent: 'MANAGER', 
      student: 'USER',
    };

    const mappedUserRole = roleMap[userRole] || userRole;
    
    return mappedUserRole === requiredRole;
  },

  /**
   * Check if admin user (backward compatibility)
   * @param {string} userRole - User role from backend
   * @returns {boolean} Whether user is admin
   */
  isAdmin(userRole) {
    return userRole === 'administrator';
  },

  /**
   * Get stored authentication token
   * @returns {string|null} JWT token or null if not found
   */
  getToken() {
    return localStorage.getItem('blog_admin_token');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Whether user has a valid token
   */
  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  },
};

// Export the configured axios instance for other services
export { authApiClient };

// Default export
export default authAPI;
