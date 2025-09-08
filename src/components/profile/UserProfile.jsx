import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/authAPI';
import { Button } from '../ui/Button';
import { FaUser, FaSignOutAlt, FaSpinner } from 'react-icons/fa';

const UserProfile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user profile on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authAPI.getCurrentUser();
      console.log('🔍 Profile response:', response);
      
      if (response.success) {
        setProfileData(response.data.user);
      } else {
        setError(response.error || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      setError('An error occurred while loading profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      
      // Call logout API
      const response = await authAPI.logout();
      console.log('🚪 Logout response:', response);
      
      // Always call context logout to clear local state
      await logout();
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if API fails
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          User Profile
        </h2>
        <Button
          onClick={fetchUserProfile}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          Refresh
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin h-6 w-6 text-blue-500" />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Profile Data */}
      {!isLoading && !error && (profileData || user) && (
        <div className="space-y-4">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
              <FaUser className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {profileData?.name || user?.name || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {profileData?.email || user?.email || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {profileData?.role || user?.role || 'N/A'}
                </span>
              </p>
            </div>

            {profileData?.lastLoginAt && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Login
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {new Date(profileData.lastLoginAt).toLocaleString()}
                </p>
              </div>
            )}

            {profileData?.isActive !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <p className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      profileData.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {profileData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={handleLogout}
              variant="danger"
              size="lg"
              className="w-full"
              disabled={isLoading}
              loading={isLoading}
            >
              <FaSignOutAlt className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
