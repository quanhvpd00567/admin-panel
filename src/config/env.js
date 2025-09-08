/**
 * Environment Configuration Utility
 * Centralizes all environment variable handling and validation
 */

// Environment variables with fallbacks
export const ENV = {
  // API Configuration
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  UPLOAD_URL:
    import.meta.env.VITE_UPLOAD_URL || 'http://localhost:3001/uploads',

  // Application Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Blog Admin Panel',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',

  // Authentication Configuration
  JWT_SECRET: import.meta.env.VITE_JWT_SECRET || 'default-secret-key',
  JWT_EXPIRES_IN: import.meta.env.VITE_JWT_EXPIRES_IN || '7d',

  // Development Configuration
  // DEBUG: import.meta.env.VITE_DEBUG === 'true' || import.meta.env.DEV,
  DEBUG: false,
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',

  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',

  // Runtime Environment
  NODE_ENV: import.meta.env.MODE,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};

// Validation function for required environment variables
export const validateEnv = () => {
  console.log('🔧 Environment validation:', {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    allEnvVars: import.meta.env
  });

  const requiredVars = ['VITE_API_BASE_URL', 'VITE_APP_NAME'];

  const missingVars = requiredVars.filter(varName => {
    const value = import.meta.env[varName];
    return !value || value.trim() === '';
  });

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  if (ENV.IS_PROD && ENV.JWT_SECRET === 'default-secret-key') {
    console.warn('Warning: Using default JWT secret in production!');
  }

  return true;
};

// Configuration object for different environments
export const CONFIG = {
  development: {
    apiTimeout: 10000,
    enableLogs: true,
    enableDevTools: true,
    enableMockData: true,
  },
  production: {
    apiTimeout: 5000,
    enableLogs: false,
    enableDevTools: false,
    enableMockData: false,
  },
  test: {
    apiTimeout: 30000,
    enableLogs: true,
    enableDevTools: true,
    enableMockData: true,
  },
};

// Get configuration for current environment
export const getConfig = () => {
  return CONFIG[ENV.NODE_ENV] || CONFIG.development;
};

// Helper function to build full API URLs
export const buildApiUrl = endpoint => {
  const baseUrl = ENV.API_BASE_URL.replace(/\/$/, ''); // Remove trailing slash
  const cleanEndpoint = endpoint.replace(/^\//, ''); // Remove leading slash
  return `${baseUrl}/${cleanEndpoint}`;
};

// Helper function to build upload URLs
export const buildUploadUrl = filename => {
  const baseUrl = ENV.UPLOAD_URL.replace(/\/$/, '');
  return `${baseUrl}/${filename}`;
};

// Development helper to log environment info
export const logEnvInfo = () => {
  if (ENV.DEBUG) {
    console.group('🔧 Environment Configuration');
    console.log('Environment:', ENV.NODE_ENV);
    console.log('API Base URL:', ENV.API_BASE_URL);
    console.log('App Name:', ENV.APP_NAME);
    console.log('App Version:', ENV.APP_VERSION);
    console.log('Debug Mode:', ENV.DEBUG);
    console.log('Features:', {
      analytics: ENV.ENABLE_ANALYTICS,
    });
    console.groupEnd();
  }
};

// Initialize environment validation
if (ENV.IS_PROD || ENV.DEBUG) {
  validateEnv();
}

// Log environment info in development
if (ENV.IS_DEV) {
  logEnvInfo();
}

export default ENV;
