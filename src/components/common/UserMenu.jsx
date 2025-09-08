import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/authAPI';
import { FaUser, FaSignOutAlt, FaSpinner, FaChevronDown } from 'react-icons/fa';

const UserMenu = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
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
      setIsLoggingOut(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="relative">
      {/* User Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        disabled={isLoggingOut}
      >
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <FaUser className="h-4 w-4 text-white" />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user.name || 'User'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user.role || 'N/A'}
          </p>
        </div>
        <FaChevronDown className="h-3 w-3 text-gray-400" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.name || 'User'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email || 'N/A'}
              </p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mt-1">
                {user.role || 'N/A'}
              </span>
            </div>

            {/* Profile Link */}
            <a
              href="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <FaUser className="h-4 w-4 mr-3" />
              View Profile
            </a>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center w-full px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
            >
              {isLoggingOut ? (
                <FaSpinner className="h-4 w-4 mr-3 animate-spin" />
              ) : (
                <FaSignOutAlt className="h-4 w-4 mr-3" />
              )}
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default UserMenu;
