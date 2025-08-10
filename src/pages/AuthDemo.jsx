import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ROLES } from '../utils/authUtils';

const AuthDemo = () => {
  const { user, isAuthenticated, login, logout, hasRole, hasPermission } =
    useAuth();

  const handleQuickLogin = async (email, password, role) => {
    try {
      const result = await login(email, password, false);
      if (result.success) {
        console.log(`Logged in as ${role}:`, result.user);
      } else {
        console.error('Login failed:', result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Authentication Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test the authentication system with demo credentials
          </p>
        </div>

        {/* Authentication Status */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Authentication Status
            </h2>

            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h3 className="text-green-800 dark:text-green-200 font-medium">
                    ✅ Authenticated
                  </h3>
                  <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                    <p>
                      <strong>Name:</strong> {user?.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {user?.email}
                    </p>
                    <p>
                      <strong>Role:</strong> {user?.role}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">
                      Role Checks
                    </h4>
                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                      <p>Admin: {hasRole(ROLES.ADMIN) ? '✅' : '❌'}</p>
                      <p>Manager: {hasRole(ROLES.MANAGER) ? '✅' : '❌'}</p>
                      <p>User: {hasRole(ROLES.USER) ? '✅' : '❌'}</p>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <h4 className="font-medium text-purple-800 dark:text-purple-200">
                      Permissions
                    </h4>
                    <div className="mt-2 text-sm text-purple-700 dark:text-purple-300">
                      <p>
                        Create Post:{' '}
                        {hasPermission('post:create') ? '✅' : '❌'}
                      </p>
                      <p>
                        Delete User:{' '}
                        {hasPermission('user:delete') ? '✅' : '❌'}
                      </p>
                      <p>
                        Admin Access:{' '}
                        {hasPermission('admin:access') ? '✅' : '❌'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">
                      Actions
                    </h4>
                    <div className="mt-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={logout}
                        className="w-full"
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h3 className="text-red-800 dark:text-red-200 font-medium">
                  ❌ Not Authenticated
                </h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  Please log in to test the system
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Login Buttons */}
        {!isAuthenticated && (
          <Card className="mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Quick Login
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Click any button below to quickly log in with demo credentials
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="danger"
                  onClick={() =>
                    handleQuickLogin('admin@blog.com', 'admin123', 'Admin')
                  }
                  className="w-full"
                >
                  Login as Admin
                </Button>

                <Button
                  variant="warning"
                  onClick={() =>
                    handleQuickLogin(
                      'manager@blog.com',
                      'manager123',
                      'Manager'
                    )
                  }
                  className="w-full"
                >
                  Login as Manager
                </Button>

                <Button
                  variant="secondary"
                  onClick={() =>
                    handleQuickLogin('user@blog.com', 'user123', 'User')
                  }
                  className="w-full"
                >
                  Login as User
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Demo Credentials */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Demo Credentials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-red-600 dark:text-red-400 mb-2">
                  Admin Account
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    <strong>Email:</strong> admin@blog.com
                  </p>
                  <p>
                    <strong>Password:</strong> admin123
                  </p>
                  <p>
                    <strong>Access:</strong> Full system access
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-yellow-600 dark:text-yellow-400 mb-2">
                  Manager Account
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    <strong>Email:</strong> manager@blog.com
                  </p>
                  <p>
                    <strong>Password:</strong> manager123
                  </p>
                  <p>
                    <strong>Access:</strong> Content management
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-2">
                  User Account
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    <strong>Email:</strong> user@blog.com
                  </p>
                  <p>
                    <strong>Password:</strong> user123
                  </p>
                  <p>
                    <strong>Access:</strong> Read-only
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AuthDemo;
