/**
 * Authentication Context
 * Global state management for user authentication and authorization
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import axios from 'axios';
import { 
  isTokenExpired, 
  getUserFromToken, 
  isValidTokenFormat,
  needsTokenRefresh,
  ROLES,
  PERMISSIONS,
  roleHasPermission,
  canAccessRole,
  getTokenErrorMessage
} from '../utils/authUtils';
import { mockAuthAPI } from '../services/mockAuthAPI';

// Create AuthContext
const AuthContext = createContext(undefined);

// Export AuthContext for direct usage in other hooks
export { AuthContext };

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Token storage keys
  const TOKEN_KEY = 'blog_admin_token';
  const REFRESH_TOKEN_KEY = 'blog_admin_refresh_token';
  const USER_KEY = 'blog_admin_user';

  // API base URL (will be configured later)
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  // Helper function to validate token
  const isTokenValid = (token) => {
    return token && isValidTokenFormat(token) && !isTokenExpired(token);
  };

  // Configure axios interceptors
  useEffect(() => {
    // Request interceptor to add token to headers
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token expiration
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            await refreshTokenHandler();
            return axios(originalRequest);
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  // Initialize auth state from storage
  useEffect(() => {
    initializeAuth();
  }, []);

  // Initialize authentication from stored tokens
  const initializeAuth = useCallback(async () => {
    try {
      const storedToken = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
      const storedRefreshToken = Cookies.get(REFRESH_TOKEN_KEY) || localStorage.getItem(REFRESH_TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        // Check if token is valid using utility function
        if (isTokenValid(storedToken)) {
          // Token is valid
          setToken(storedToken);
          setRefreshToken(storedRefreshToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else if (storedRefreshToken) {
          // Try to refresh token
          await refreshTokenHandler();
        } else {
          // Token expired and no refresh token
          clearAuthData();
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Store auth data securely
  const storeAuthData = (authToken, authRefreshToken, userData, rememberMe = false) => {
    if (rememberMe) {
      // Store in cookies for persistent login
      Cookies.set(TOKEN_KEY, authToken, { expires: 7, secure: true, sameSite: 'strict' });
      Cookies.set(REFRESH_TOKEN_KEY, authRefreshToken, { expires: 30, secure: true, sameSite: 'strict' });
    } else {
      // Store in localStorage for session
      localStorage.setItem(TOKEN_KEY, authToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, authRefreshToken);
    }
    
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    
    setToken(authToken);
    setRefreshToken(authRefreshToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Clear auth data
  const clearAuthData = () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Login function
  const login = async (email, password, rememberMe = false) => {
    try {
      setIsLoading(true);
      
      // Use mock API for development
      const response = await mockAuthAPI.login(email, password);
      
      if (!response.success) {
        return response; // Return error with field and message
      }
      
      const { user: userData, token: authToken, refreshToken: authRefreshToken } = response.data;
      
      storeAuthData(authToken, authRefreshToken, userData, rememberMe);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      
      return { 
        success: false, 
        message: 'An unexpected error occurred. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setIsLoading(true);
      
      // Use mock API for development
      const response = await mockAuthAPI.register(userData);
      
      if (!response.success) {
        return response; // Return error with field and message
      }
      
      return { success: true, user: response.data.user };
    } catch (error) {
      console.error('Registration error:', error);
      
      return { 
        success: false, 
        message: 'An unexpected error occurred. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (token) {
        await mockAuthAPI.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
    }
  };

  // Refresh token function
  const refreshTokenHandler = async () => {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await mockAuthAPI.refreshToken(refreshToken);
      
      if (!response.success) {
        throw new Error(response.message || 'Token refresh failed');
      }

      const { token: newToken, refreshToken: newRefreshToken } = response.data;
      
      // Update tokens
      const rememberMe = Cookies.get(TOKEN_KEY) ? true : false;
      storeAuthData(newToken, newRefreshToken, user, rememberMe);
      
      return newToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      clearAuthData();
      throw error;
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!user || !user.role) return false;
    
    // Role hierarchy: admin > manager > user
    const roleHierarchy = {
      admin: ['admin', 'manager', 'user'],
      manager: ['manager', 'user'],
      user: ['user']
    };
    
    const userRole = user.role.toLowerCase();
    return roleHierarchy[userRole]?.includes(role.toLowerCase()) || false;
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    
    // Check if user has the specific permission
    return user.permissions.includes(permission);
  };

  // Get current user profile
  const getCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      const userData = response.data.user;
      
      setUser(userData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
      return { success: true };
    } catch (error) {
      console.error('Forgot password error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          'Failed to send reset email. Please try again.';
      
      return { success: false, error: errorMessage };
    }
  };

  // Reset password
  const resetPassword = async (token, newPassword) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        token,
        password: newPassword
      });
      
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          'Failed to reset password. Please try again.';
      
      return { success: false, error: errorMessage };
    }
  };

  // Context value
  const value = {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    
    // Actions
    login,
    register,
    logout,
    refreshToken: refreshTokenHandler,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    
    // Permissions
    hasRole,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
