/**
 * Authentication Hooks
 * Custom hooks for authentication-related functionality
 */

import { useState, useEffect, useContext } from 'react';
import {
  AuthContext,
  useAuth as useAuthContext,
} from '../contexts/AuthContext';

// Hook to check if user has specific role
export const useRole = requiredRole => {
  const { hasRole, user, isLoading } = useContext(AuthContext);

  return {
    hasRole: hasRole(requiredRole),
    isLoading,
    user,
  };
};

// Hook to check if user has specific permission
export const usePermission = requiredPermission => {
  const { hasPermission, user, isLoading } = useContext(AuthContext);

  return {
    hasPermission: hasPermission(requiredPermission),
    isLoading,
    user,
  };
};

// Hook for protected actions that require authentication
export const useProtectedAction = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  const executeIfAuthenticated = (action, fallback) => {
    if (isAuthenticated) {
      return action();
    } else {
      return fallback ? fallback() : null;
    }
  };

  return {
    isAuthenticated,
    user,
    executeIfAuthenticated,
  };
};

// Hook for handling auth state changes
export const useAuthState = () => {
  const { isAuthenticated, user, isLoading } = useContext(AuthContext);
  const [authState, setAuthState] = useState('loading');

  useEffect(() => {
    if (isLoading) {
      setAuthState('loading');
    } else if (isAuthenticated && user) {
      setAuthState('authenticated');
    } else {
      setAuthState('unauthenticated');
    }
  }, [isAuthenticated, user, isLoading]);

  return {
    authState,
    isLoading,
    isAuthenticated,
    user,
  };
};

// Hook for auth redirects
export const useAuthRedirect = (redirectTo = '/login') => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  const shouldRedirect = !isLoading && !isAuthenticated;

  return {
    shouldRedirect,
    redirectTo,
    isLoading,
    isAuthenticated,
  };
};

// Main useAuth hook - re-export from AuthContext
export const useAuth = useAuthContext;

export default {
  useAuth,
  useRole,
  usePermission,
  useProtectedAction,
  useAuthState,
  useAuthRedirect,
};
