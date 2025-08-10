import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES, canAccessRole } from '../../utils/authUtils';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * RoleGuard Component
 * Protects routes by checking user role and permissions
 * Redirects to unauthorized page if user doesn't have required role
 */
const RoleGuard = ({
  children,
  allowedRoles = [],
  requiredPermissions = [],
  fallbackPath = '/dashboard',
}) => {
  const { user, isAuthenticated, isLoading, hasRole, hasPermission } =
    useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  const hasRequiredRole =
    allowedRoles.length === 0 ||
    allowedRoles.some(role => {
      return hasRole(role) || canAccessRole(user.role, role);
    });

  // Check permission-based access
  const hasRequiredPermissions =
    requiredPermissions.length === 0 ||
    requiredPermissions.every(permission => hasPermission(permission));

  // If user doesn't have required role or permissions
  if (!hasRequiredRole || !hasRequiredPermissions) {
    return <Navigate to={fallbackPath} replace />;
  }

  // User is authorized, render the component
  return children;
};

/**
 * AdminRoute Component
 * Shorthand for routes that require admin role
 */
export const AdminRoute = ({ children, fallbackPath = '/dashboard' }) => {
  return (
    <RoleGuard allowedRoles={[ROLES.ADMIN]} fallbackPath={fallbackPath}>
      {children}
    </RoleGuard>
  );
};

/**
 * ManagerRoute Component
 * Shorthand for routes that require manager or admin role
 */
export const ManagerRoute = ({ children, fallbackPath = '/dashboard' }) => {
  return (
    <RoleGuard
      allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}
      fallbackPath={fallbackPath}
    >
      {children}
    </RoleGuard>
  );
};

/**
 * PermissionRoute Component
 * Shorthand for routes that require specific permissions
 */
export const PermissionRoute = ({
  children,
  permissions = [],
  fallbackPath = '/dashboard',
}) => {
  return (
    <RoleGuard requiredPermissions={permissions} fallbackPath={fallbackPath}>
      {children}
    </RoleGuard>
  );
};

export default RoleGuard;
