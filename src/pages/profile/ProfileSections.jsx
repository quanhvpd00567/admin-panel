/**
 * User Profile Section Components
 * Additional sections for the UserProfile page
 */

import React, { useState } from 'react';
import { 
  FiCamera, FiUpload, FiTrash2, FiLock, FiEye, FiEyeOff, 
  FiGlobe, FiBell, FiMoon, FiSun, FiMonitor, FiSave,
  FiActivity, FiMapPin, FiClock, FiShield
} from 'react-icons/fi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import { showToast } from '../../components/ui/Toast';

// Avatar Section Component
export const AvatarSection = ({ userProfile, avatarPreview, handleAvatarChange, onSave, loading }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleAvatarChange({ target: { files: [file] } });
      } else {
        showToast.error('Please drop an image file');
      }
    }
  };

  const removeAvatar = () => {
    // Set to default avatar
    const defaultAvatar = `https://ui-avatars.com/api/?name=${userProfile.firstName}+${userProfile.lastName}&background=random&size=150`;
    handleAvatarChange({ target: { files: [] } });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Avatar & Media
      </h2>

      <div className="space-y-6">
        {/* Current Avatar */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={avatarPreview}
              alt={userProfile.displayName}
              className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${userProfile.firstName}+${userProfile.lastName}&background=random&size=128`;
              }}
            />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Profile Picture
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Upload a new avatar or use the default one. Images should be at least 150x150px.
            </p>
            
            <div className="flex space-x-3">
              <label className="cursor-pointer">
                <Button variant="outline">
                  <FiUpload className="w-4 h-4 mr-2" />
                  Upload New
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
              
              <Button variant="outline" onClick={removeAvatar}>
                <FiTrash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        </div>

        {/* Drag & Drop Area */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragOver 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FiCamera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Drag and drop an image here, or click to select
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Supports: JPG, PNG, WebP (Max: 2MB)
          </p>
        </div>

        {/* Avatar Guidelines */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
            Avatar Guidelines
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• Use a clear, professional photo</li>
            <li>• Image will be cropped to square (1:1 ratio)</li>
            <li>• Minimum resolution: 150x150 pixels</li>
            <li>• Maximum file size: 2MB</li>
            <li>• Supported formats: JPG, PNG, WebP</li>
          </ul>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={onSave} loading={loading}>
            <FiSave className="w-4 h-4 mr-2" />
            Save Avatar
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Security Section Component
export const SecuritySection = ({ passwordRegister, passwordErrors, onSubmitPassword, loading, newPassword }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: 'No password', color: 'gray' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
      { score: 0, label: 'Very Weak', color: 'red' },
      { score: 1, label: 'Weak', color: 'red' },
      { score: 2, label: 'Fair', color: 'yellow' },
      { score: 3, label: 'Good', color: 'blue' },
      { score: 4, label: 'Strong', color: 'green' },
      { score: 5, label: 'Very Strong', color: 'green' }
    ];

    return levels[score] || levels[0];
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Security Settings
      </h2>

      <form onSubmit={onSubmitPassword} className="space-y-6">
        {/* Change Password Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Change Password
          </h3>
          
          <div className="space-y-4">
            {/* Current Password */}
            <div className="relative">
              <Input
                label="Current Password"
                type={showCurrentPassword ? 'text' : 'password'}
                {...passwordRegister('currentPassword', { 
                  required: 'Current password is required' 
                })}
                error={passwordErrors.currentPassword?.message}
                leftIcon={<FiLock />}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <Input
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                {...passwordRegister('newPassword', { 
                  required: 'New password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                  }
                })}
                error={passwordErrors.newPassword?.message}
                leftIcon={<FiLock />}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showNewPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 bg-${passwordStrength.color}-500`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className={`text-sm font-medium text-${passwordStrength.color}-600 dark:text-${passwordStrength.color}-400`}>
                    {passwordStrength.label}
                  </span>
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div className="relative">
              <Input
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                {...passwordRegister('confirmPassword', { 
                  required: 'Please confirm your new password',
                  validate: value => value === newPassword || 'Passwords do not match'
                })}
                error={passwordErrors.confirmPassword?.message}
                leftIcon={<FiLock />}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            Password Requirements
          </h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li className={newPassword?.length >= 8 ? 'text-green-600 dark:text-green-400' : ''}>
              • At least 8 characters long
            </li>
            <li className={/[a-z]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : ''}>
              • Contains lowercase letters (a-z)
            </li>
            <li className={/[A-Z]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : ''}>
              • Contains uppercase letters (A-Z)
            </li>
            <li className={/\d/.test(newPassword) ? 'text-green-600 dark:text-green-400' : ''}>
              • Contains numbers (0-9)
            </li>
            <li className={/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : ''}>
              • Contains special characters (!@#$%^&*)
            </li>
          </ul>
        </div>

        {/* Two-Factor Authentication (Future Feature) */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Two-Factor Authentication
          </h3>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <FiShield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-300">
                  Enhanced Security Coming Soon
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  Two-factor authentication will be available in a future update.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" loading={loading}>
            <FiSave className="w-4 h-4 mr-2" />
            Change Password
          </Button>
        </div>
      </form>
    </Card>
  );
};

// Preferences Section Component
export const PreferencesSection = ({ userProfile, register, errors, isEditing, setIsEditing, onSave, loading }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Preferences
        </h2>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            Edit Preferences
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={onSave} loading={loading}>
              <FiSave className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {/* Appearance */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <FiMonitor className="w-5 h-5 mr-2" />
            Appearance
          </h3>
          
          <div className="space-y-4">
            <Select
              label="Theme"
              {...register('theme')}
              disabled={!isEditing}
            >
              <option value="light">🌞 Light</option>
              <option value="dark">🌙 Dark</option>
              <option value="system">💻 System</option>
            </Select>

            <Select
              label="Language"
              {...register('language')}
              disabled={!isEditing}
            >
              <option value="en">🇺🇸 English</option>
              <option value="es">🇪🇸 Spanish</option>
              <option value="fr">🇫🇷 French</option>
              <option value="de">🇩🇪 German</option>
              <option value="ja">🇯🇵 Japanese</option>
              <option value="zh">🇨🇳 Chinese</option>
            </Select>
          </div>
        </div>

        {/* Notifications */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <FiBell className="w-5 h-5 mr-2" />
            Notifications
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900 dark:text-white">
                  Email Notifications
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive notifications via email
                </p>
              </div>
              <input
                type="checkbox"
                {...register('emailNotifications')}
                disabled={!isEditing}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900 dark:text-white">
                  Push Notifications
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive push notifications in browser
                </p>
              </div>
              <input
                type="checkbox"
                {...register('pushNotifications')}
                disabled={!isEditing}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900 dark:text-white">
                  New Posts
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get notified when new posts are published
                </p>
              </div>
              <input
                type="checkbox"
                {...register('newPostsNotifications')}
                disabled={!isEditing}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900 dark:text-white">
                  Comments
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get notified about comments on your posts
                </p>
              </div>
              <input
                type="checkbox"
                {...register('commentsNotifications')}
                disabled={!isEditing}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Activity Section Component
export const ActivitySection = ({ activityLog, formatActivity }) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Activity Log
      </h2>

      <div className="space-y-4">
        {activityLog.length > 0 ? (
          activityLog.map((activity) => {
            const activityInfo = formatActivity(activity);
            return (
              <div 
                key={activity.id}
                className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="text-2xl">{activityInfo.icon}</div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${activityInfo.color}`}>
                      {activityInfo.label}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <FiMapPin className="w-3 h-3" />
                      <span>{activity.ipAddress}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiClock className="w-3 h-3" />
                      <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  {activity.details && Object.keys(activity.details).length > 0 && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {activity.action === 'profile_update' && activity.details.field && (
                        <span>Updated: {activity.details.field}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <FiActivity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No activity recorded yet</p>
          </div>
        )}
      </div>

      {/* Export Activity Button */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="outline" className="w-full">
          Export Activity Log
        </Button>
      </div>
    </Card>
  );
};
