/**
 * Common API Client
 * Centralized axios configuration for all API services
 */

import axios from 'axios';
import { ENV } from '../config/env.js';

// Create a single axios instance for all API calls
const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get token (to avoid circular dependency)
const getToken = () => {
  return localStorage.getItem('blog_admin_token');
};

// Function to handle logout (to avoid circular dependency)
const handleLogout = () => {
  localStorage.removeItem('blog_admin_token');
  localStorage.removeItem('blog_admin_user');
  window.location.href = '/login';
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration and errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      handleLogout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
