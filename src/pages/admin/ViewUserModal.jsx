/**
 * View User Modal Component
 * Modal for viewing detailed user information
 */

import React from 'react';
import { FiX, FiMail, FiPhone, FiCalendar, FiUser, FiActivity, FiEdit2 } from 'react-icons/fi';
import { userRoles, userStatuses } from '../../services/mockUserData';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const ViewUserModal = ({ user, onClose, onEdit }) => {
  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatShortDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const roleInfo = userRoles[user.role];
  const statusInfo = userStatuses[user.status];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt={user.displayName}
              className="w-12 h-12 rounded-full"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&size=48`;
              }}
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user.displayName}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(user)}
              >
                <FiEdit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Role */}
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className={statusInfo?.badge}>
              {statusInfo?.name || user.status}
            </Badge>
            <Badge variant="secondary" className={roleInfo?.badge}>
              {roleInfo?.name || user.role}
            </Badge>
            {user.emailVerified ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Email Verified
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                Email Unverified
              </Badge>
            )}
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Personal Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <FiUser className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                    <p className="text-gray-900 dark:text-white">{user.displayName}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FiMail className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-white">{user.email}</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center">
                    <FiPhone className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="text-gray-900 dark:text-white">{user.phone}</p>
                    </div>
                  </div>
                )}

                {user.department && (
                  <div className="flex items-start">
                    <div className="w-5 h-5 text-gray-400 mr-3 mt-0.5">🏢</div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                      <p className="text-gray-900 dark:text-white">{user.department}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Account Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <FiCalendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                    <p className="text-gray-900 dark:text-white">{formatShortDate(user.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FiActivity className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Login</p>
                    <p className="text-gray-900 dark:text-white">{formatShortDate(user.lastLogin)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-5 h-5 text-gray-400 mr-3 mt-0.5">🆔</div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
                    <p className="text-gray-900 dark:text-white font-mono text-sm">{user.id}</p>
                  </div>
                </div>

                {user.timezone && (
                  <div className="flex items-start">
                    <div className="w-5 h-5 text-gray-400 mr-3 mt-0.5">🌍</div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Timezone</p>
                      <p className="text-gray-900 dark:text-white">{user.timezone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
                Bio
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {user.bio}
              </p>
            </div>
          )}

          {/* Role Details */}
          {roleInfo && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
                Role & Permissions
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">{roleInfo.name}</h4>
                  <Badge variant="secondary" className={roleInfo.badge}>
                    {roleInfo.name}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {roleInfo.description}
                </p>
                {roleInfo.permissions && roleInfo.permissions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Permissions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {roleInfo.permissions.map((permission, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded"
                        >
                          {permission === '*' ? 'All Permissions' : permission}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User Statistics */}
          {user.stats && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
                Activity Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {user.stats.postsCount || 0}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Posts Created</p>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {user.stats.loginCount || 0}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">Total Logins</p>
                  </div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      {user.stats.lastActivity ? formatShortDate(user.stats.lastActivity) : 'Never'}
                    </p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Last Activity</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences */}
          {user.preferences && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
                User Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Interface</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Theme:</span>
                      <span className="text-gray-900 dark:text-white capitalize">
                        {user.preferences.theme || 'System'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Language:</span>
                      <span className="text-gray-900 dark:text-white">
                        {user.language || 'English'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {user.preferences.notifications && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Notifications</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Email:</span>
                        <span className="text-gray-900 dark:text-white">
                          {user.preferences.notifications.email ? '✅ Enabled' : '❌ Disabled'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Push:</span>
                        <span className="text-gray-900 dark:text-white">
                          {user.preferences.notifications.push ? '✅ Enabled' : '❌ Disabled'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">New Posts:</span>
                        <span className="text-gray-900 dark:text-white">
                          {user.preferences.notifications.newPosts ? '✅ Enabled' : '❌ Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Audit Information */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Audit Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
              <div>
                <p><strong>Created:</strong> {formatDate(user.createdAt)}</p>
                <p><strong>Last Updated:</strong> {formatDate(user.updatedAt)}</p>
              </div>
              <div>
                <p><strong>Created By:</strong> {user.createdBy || 'System'}</p>
                <p><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;
