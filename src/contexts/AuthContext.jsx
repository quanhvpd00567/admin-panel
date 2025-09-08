/**
 * Authentication Context
 * Global state management for user authentication and authorization
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
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
  getTokenErrorMessage,
} from '../utils/authUtils';
import { authAPI } from '../services/authAPI';

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
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  // Helper function to validate token
  const isTokenValid = token => {
    return token && isValidTokenFormat(token) && !isTokenExpired(token);
  };

  // Helper function to validate auth state without API calls
  const validateAuthLocally = () => {
    const storedToken = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    
    if (storedToken && storedUser && isTokenValid(storedToken)) {
      const userData = JSON.parse(storedUser);
      setToken(storedToken);
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  // Configure axios interceptors
  useEffect(() => {
    // Request interceptor to add token to headers
    const requestInterceptor = axios.interceptors.request.use(
      config => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token expiration
    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        // Only handle 401 errors (unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Check if we have a valid token locally before calling logout
          const currentToken = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
          
          if (currentToken && isTokenValid(currentToken)) {
            return axios(originalRequest);
          } else {
            // Token is actually expired, logout
            logout();
          }
        }

        // For network errors (no response), don't logout automatically
        if (!error.response) {
          console.warn('Network error, not logging out automatically:', error.message);
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
    console.log('🚀 Initializing auth...');
    
    try {
      const storedToken =
        Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      console.log('📁 Found stored data:', {
        hasToken: !!storedToken,
        hasUser: !!storedUser,
        tokenPreview: storedToken ? storedToken.substring(0, 20) + '...' : null
      });

      if (storedToken && storedUser) {
        // First, check token validity locally (JWT decode)
        if (isTokenValid(storedToken)) {
          console.log('✅ Token is valid locally');
          const userData = JSON.parse(storedUser);
          
          // Set auth state immediately with stored data
          setToken(storedToken);
          setUser(userData);
          setIsAuthenticated(true);
          setIsLoading(false);

          console.log('🎯 Auth state set from storage:', {
            userId: userData.id,
            userEmail: userData.email,
            userRole: userData.role
          });

          // Only validate with backend if token needs refresh soon (optional background validation)
          if (needsTokenRefresh(storedToken)) {
            console.log('⏰ Token needs refresh, validating with backend...');
            try {
              const validation = await authAPI.validateToken(storedToken);
              
              if (validation.success) {
                console.log('✅ Backend validation successful');
                // Token is still valid, optionally get fresh user data
                const currentUser = await authAPI.getCurrentUser();
                
                if (currentUser.success) {
                  console.log('👤 Updated user data from backend');
                  setUser(currentUser.data.user);
                  localStorage.setItem(USER_KEY, JSON.stringify(currentUser.data.user));
                }
              } else {
                console.log('❌ Backend validation failed, clearing auth');
                // Token is invalid on backend, clear auth
                clearAuthData();
              }
            } catch (error) {
              console.warn('⚠️ Background token validation failed, but keeping local auth:', error);
              // Don't clear auth data on network errors - user can still use the app
            }
          } else {
            console.log('✅ Token is fresh, no backend validation needed');
          }
        } else {
          // Token is expired locally
          console.log('❌ Token is expired locally, clearing auth data');
          clearAuthData();
          setIsLoading(false);
        }
      } else {
        // No stored token or user data
        console.log('📭 No stored auth data found');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('💥 Auth initialization error:', error);
      // On error, try to preserve auth if token is still valid locally
      const storedToken = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      
      if (storedToken && storedUser && isTokenValid(storedToken)) {
        console.log('🛡️ Preserving auth despite error (token still valid)');
        // Keep user logged in even if API call failed
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } else {
        console.log('🧹 Clearing auth due to error');
        clearAuthData();
      }
      setIsLoading(false);
    }
  }, []);

  // Store auth data securely
  const storeAuthData = (
    authToken,
    authRefreshToken,
    userData,
    rememberMe = false
  ) => {
    if (rememberMe) {
      // Store in cookies for persistent login
      Cookies.set(TOKEN_KEY, authToken, {
        expires: 7,
        secure: true,
        sameSite: 'strict',
      });
    } else {
      // Store in localStorage for session
      localStorage.setItem(TOKEN_KEY, authToken);
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

      // Use real API for authentication
      const response = await authAPI.login(email, password);
      if (!response.success) {
        return {
          success: false,
          message: response.error || 'Login failed. Please try again.',
        };
      }

      const {
        user: userData,
        token: authToken,
        expiresAt,
      } = response.data;

      storeAuthData(authToken, null, userData, rememberMe);

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);

      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async userData => {
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
        message: 'An unexpected error occurred. Please try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
    }
  };

  // Refresh token function (placeholder - not implemented in backend yet)
  const refreshTokenHandler = async () => {
    console.warn('Token refresh not implemented yet');
    clearAuthData();
    throw new Error('Token expired. Please login again.');
  };

  // Check if user has specific role
  const hasRole = role => {
    if (!user || !user.role) return false;

    // Map backend roles to frontend roles
    const roleMap = {
      administrator: ROLES.ADMIN,
      parent: ROLES.MANAGER,
      student: ROLES.STUDENT,
    };

    const mappedUserRole = roleMap[user.role] || user.role.toLowerCase();
    
    // Role hierarchy: admin > manager > user
    const roleHierarchy = {
      admin: [ROLES.ADMIN, ROLES.PARENT, ROLES.STUDENT],
      parent: [ROLES.MANAGER],
      student: [ROLES.STUDENT],
    };

    return roleHierarchy[mappedUserRole]?.includes(role.toLowerCase()) || false;
  };

  // Check if user has specific permission
  const hasPermission = permission => {
    if (!user || !user.role) return false;

    // For now, only administrators have all permissions
    // This can be expanded later with more granular permissions
    return user.role === ROLES.ADMIN;
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
  const forgotPassword = async email => {
    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
      return { success: true };
    } catch (error) {
      console.error('Forgot password error:', error);

      const errorMessage =
        error.response?.data?.message ||
        'Failed to send reset email. Please try again.';

      return { success: false, error: errorMessage };
    }
  };

  // Reset password
  const resetPassword = async (token, newPassword) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        token,
        password: newPassword,
      });

      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);

      const errorMessage =
        error.response?.data?.message ||
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
    validateAuthLocally,

    // Permissions
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
