/**
 * Authentication Utilities
 * Helper functions for token management and validation
 */

import { jwtDecode } from 'jwt-decode';

// Check if token is expired
export const isTokenExpired = token => {
  if (!token) return true;

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Add 5 minute buffer before actual expiration
    return decodedToken.exp < currentTime + 300;
  } catch (error) {
    console.error('Token decode error:', error);
    return true;
  }
};

// Get token expiration time
export const getTokenExpiration = token => {
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);
    return new Date(decodedToken.exp * 1000);
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

// Get user data from token
export const getUserFromToken = token => {
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);
    return {
      id: decodedToken.sub || decodedToken.id,
      email: decodedToken.email,
      role: decodedToken.role,
      permissions: decodedToken.permissions || [],
      name: decodedToken.name,
      exp: decodedToken.exp,
      iat: decodedToken.iat,
    };
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

// Validate token format
export const isValidTokenFormat = token => {
  if (!token || typeof token !== 'string') return false;

  // JWT should have 3 parts separated by dots
  const parts = token.split('.');
  return parts.length === 3;
};

// Get time until token expires (in seconds)
export const getTimeUntilExpiration = token => {
  if (!token) return 0;

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return Math.max(0, decodedToken.exp - currentTime);
  } catch (error) {
    console.error('Token decode error:', error);
    return 0;
  }
};

// Check if token needs refresh (within 5 minutes of expiration)
export const needsTokenRefresh = token => {
  if (!token) return true;

  const timeUntilExpiration = getTimeUntilExpiration(token);
  return timeUntilExpiration < 300; // 5 minutes
};

// Role hierarchy for permission checking
export const ROLES = {
  ADMIN: 'administrator',
  PARENT: 'parent',
  STUDENT: 'student',
};

// Permission constants
export const PERMISSIONS = {
  // User management
  CREATE_USER: 'user:create',
  READ_USER: 'user:read',
  UPDATE_USER: 'user:update',
  DELETE_USER: 'user:delete',

  // Post management
  CREATE_POST: 'post:create',
  READ_POST: 'post:read',
  UPDATE_POST: 'post:update',
  DELETE_POST: 'post:delete',
  PUBLISH_POST: 'post:publish',

  // Admin functions
  ACCESS_ADMIN: 'admin:access',
  MANAGE_SETTINGS: 'admin:settings',
  VIEW_ANALYTICS: 'admin:analytics',

  // Media management
  UPLOAD_MEDIA: 'media:upload',
  DELETE_MEDIA: 'media:delete',

  // Category and tag management
  MANAGE_CATEGORIES: 'category:manage',
  MANAGE_TAGS: 'tag:manage',
};

// Default permissions by role
export const DEFAULT_PERMISSIONS = {
  [ROLES.ADMIN]: [...Object.values(PERMISSIONS)],
  [ROLES.PARENT]: [
    PERMISSIONS.CREATE_POST,
    PERMISSIONS.READ_POST,
    PERMISSIONS.UPDATE_POST,
    PERMISSIONS.DELETE_POST,
    PERMISSIONS.PUBLISH_POST,
    PERMISSIONS.READ_USER,
    PERMISSIONS.UPLOAD_MEDIA,
    PERMISSIONS.DELETE_MEDIA,
    PERMISSIONS.MANAGE_CATEGORIES,
    PERMISSIONS.MANAGE_TAGS,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  [ROLES.STUDENT]: [PERMISSIONS.READ_POST, PERMISSIONS.READ_USER],
};

// Check if role has permission
export const roleHasPermission = (role, permission) => {
  const rolePermissions = DEFAULT_PERMISSIONS[role] || [];
  return rolePermissions.includes(permission);
};

// Check if role can access another role's functions
export const canAccessRole = (currentRole, targetRole) => {
  const hierarchy = {
    [ROLES.ADMIN]: [ROLES.ADMIN, ROLES.PARENT, ROLES.STUDENT],
    [ROLES.PARENT]: [ROLES.PARENT],
    [ROLES.STUDENT]: [ROLES.STUDENT],
  };

  return hierarchy[currentRole]?.includes(targetRole) || false;
};

// Format token error messages
export const getTokenErrorMessage = error => {
  if (error.message?.includes('expired')) {
    return 'Your session has expired. Please log in again.';
  }

  if (error.message?.includes('invalid')) {
    return 'Invalid authentication token. Please log in again.';
  }

  if (error.message?.includes('malformed')) {
    return 'Authentication error. Please log in again.';
  }

  return 'Authentication error. Please try again.';
};

export default {
  isTokenExpired,
  getTokenExpiration,
  getUserFromToken,
  isValidTokenFormat,
  getTimeUntilExpiration,
  needsTokenRefresh,
  ROLES,
  PERMISSIONS,
  DEFAULT_PERMISSIONS,
  roleHasPermission,
  canAccessRole,
  getTokenErrorMessage,
};
