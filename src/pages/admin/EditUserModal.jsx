/**
 * Edit User Modal Component
 * Modal for editing existing user information
 */

import React, { useState, useEffect } from 'react';
import { FiX, FiUser, FiMail, FiPhone, FiFileText, FiUpload, FiRefreshCw } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { userAPI } from '../../services/userAPI';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TextArea from '../../components/ui/TextArea';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { showToast } from '../../components/ui/Toast';

const EditUserModal = ({ id, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [isLoadFirst, setIsLoadFirst] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [avatarPreview, setAvatarPreview] = useState('');

  // User roles configuration
  const roleOptions = [
    { value: 'administrator', label: 'Administrator' },
    { value: 'parent', label: 'Parent' },
    { value: 'student', label: 'Student' }
  ];

  // User status configuration
  const statusOptions = [
    { value: 1, label: 'Active' },
    { value: 0, label: 'Inactive' }
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      role: 'student',
      isActive: true,
      phone: '',
      bio: '',
      isEmailVerified: false
    }
  });

  // Fetch latest user data from API
  const fetchUserData = async () => {
    try {
      setLoadingUserData(true);
      const result = await userAPI.getUser(id);

      if (result.success) {
        setIsLoadFirst(true);
        const userData = result.data.user;
        setCurrentUser(userData);
        
        // Reset form with fresh data from API
        reset({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          username: userData.username || '',
          role: userData.role || 'student',
          isActive: userData.isActive === undefined || !userData.isActive ? 0 : 1,
          phone: userData.phone || '',
          bio: userData.bio || '',
          isEmailVerified: userData.isEmailVerified || false
        });
        
        setAvatarPreview(userData.avatar);
      } else {
        showToast.error(result.error || 'Failed to load user data');
        onClose();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      showToast.error(`Error loading user data: ${error.message}`);
      onClose();
    } finally {
      setLoadingUserData(false);
    }
  };

  // Load fresh user data when modal opens
  useEffect(() => {
    if (id && !isLoadFirst) {
      console.log(`Loading user data for ID: ${id}`, isLoadFirst);
      fetchUserData();
    }
  }, [id, isLoadFirst]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast.error('Please select an image file');
        return;
      }

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        showToast.error('File size must be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
        setValue('avatar', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const result = await userAPI.updateUser(currentUser.id, data);
      
      if (result.success) {
        showToast.success('User updated successfully!');
        onSuccess();
        onClose();
      } else {
        showToast.error(result.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Update user error:', error);
      showToast.error(`Error updating user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit User: {currentUser?.fullName || `${currentUser?.firstName} ${currentUser?.lastName}` || currentUser?.username}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchUserData}
              disabled={loadingUserData}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Refresh user data"
            >
              <FiRefreshCw className={`w-5 h-5 ${loadingUserData ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loadingUserData ? (
          <div className="p-6 flex items-center justify-center">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading user data...</span>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Avatar Upload */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-20 h-20 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${currentUser?.firstName}+${currentUser?.lastName}&background=random&size=80`;
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload-edit"
              />
              <label
                htmlFor="avatar-upload-edit"
                className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <FiUpload className="w-4 h-4 mr-2" />
                Change Image
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                JPG, PNG or WebP. Max size 2MB.
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name *
              </label>
              <Input
                {...register('firstName', { 
                  required: 'First name is required',
                  maxLength: { value: 50, message: 'First name too long' }
                })}
                placeholder="Enter first name"
                error={errors.firstName?.message}
                leftIcon={<FiUser />}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name *
              </label>
              <Input
                {...register('lastName', { 
                  required: 'Last name is required',
                  maxLength: { value: 50, message: 'Last name too long' }
                })}
                placeholder="Enter last name"
                error={errors.lastName?.message}
                leftIcon={<FiUser />}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                placeholder="Enter email address"
                error={errors.email?.message}
                leftIcon={<FiMail />}
                disabled
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <Input
                {...register('username', {
                  maxLength: { value: 50, message: 'Username too long' }
                })}
                placeholder="Enter username"
                error={errors.username?.message}
                leftIcon={<FiUser />}
                disabled
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Username cannot be changed
              </p>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <Input
              type="tel"
              {...register('phone')}
              placeholder="Enter phone number"
              error={errors.phone?.message}
              leftIcon={<FiPhone />}
            />
          </div>

          {/* Role and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role *
              </label>
              <Select
                {...register('role', { required: 'Role is required' })}
                error={errors.role?.message}
              >
                {roleOptions.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status *
              </label>
              <Select
                {...register('isActive', { required: 'Status is required' })}
                error={errors.isActive?.message}
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Email Verification */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('isEmailVerified')}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Verified
              </span>
            </label>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <TextArea
              {...register('bio', {
                maxLength: { value: 500, message: 'Bio too long (max 500 characters)' }
              })}
              placeholder="Enter a brief bio (optional)"
              rows={3}
              error={errors.bio?.message}
            />
          </div>

          {/* User Metadata (Read-only) */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              User Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">User ID:</span>
                <span className="ml-2 text-gray-900 dark:text-white font-mono">{currentUser?.id}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Created:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Last Login:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {currentUser?.lastLoginAt ? new Date(currentUser.lastLoginAt).toLocaleDateString() : 'Never'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Login Attempts:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{currentUser?.loginAttempts || 0}</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Updating...
                </>
              ) : (
                'Update User'
              )}
            </Button>
          </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditUserModal;
