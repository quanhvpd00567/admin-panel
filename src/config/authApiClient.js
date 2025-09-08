/**
 * Auth API Client
 * Simple axios instance for authentication calls (no interceptors to avoid circular dependency)
 */

import axios from 'axios';
import { ENV } from '../config/env.js';

// Create a simple axios instance for auth API calls (no interceptors)
const authApiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default authApiClient;
