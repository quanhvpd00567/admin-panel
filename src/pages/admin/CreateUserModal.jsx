/**
 * Create User Modal Component
 * Modal for creating new users with role assignment
 */

import React, { useState } from 'react';
import { FiX, FiUser, FiMail, FiLock, FiPhone, FiFileText, FiUpload } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { userAPI, userRoles, userStatuses } from '../../services/userAPI';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TextArea from '../../components/ui/TextArea';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { showToast } from '../../components/ui/Toast';

const CreateUserModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      role: 'student',
      isActive: true,
      phone: '',
      department: '',
      bio: '',
      isEmailVerified: false
    }
  });

  // User statuses for the form (active/inactive)
  const statusOptions = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' }
  ];

  // User roles for the form
  const roleOptions = [
    { value: 'administrator', label: 'Administrator' },
    { value: 'parent', label: 'Parent' },
    { value: 'student', label: 'Student' }
  ];


  const password = watch('password');

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

      // Validate password confirmation
      if (data.password !== data.confirmPassword) {
        showToast.error('Passwords do not match');
        return;
      }

      // Remove confirmPassword and prepare user data for API
      const { confirmPassword, ...userData } = data;
      
      // Generate username if not provided
      if (!userData.username) {
        userData.username = userData.email.split('@')[0];
      }

      const result = await userAPI.createUser(userData);
      
      if (result.success) {
        showToast.success('User created successfully!');
        onSuccess();
        onClose();
      } else {
        showToast.error(result.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Create user error:', error);
      showToast.error(`Error creating user: ${error.message}`);
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
            Create New User
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Avatar Upload */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <FiUser className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <FiUpload className="w-4 h-4 mr-2" />
                Upload Image
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                JPG, PNG or WebP. Max size 2MB.
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                Username
              </label>
              <Input
                {...register('username', {
                  maxLength: { value: 50, message: 'Username too long' }
                })}
                placeholder="Auto-generated from email if empty"
                error={errors.username?.message}
                leftIcon={<FiUser />}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Leave empty to auto-generate from email
              </p>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
              Phone Number
            </label>
            <Input
              type="tel"
              {...register('phone', {
                pattern: {
                  message: 'Invalid phone number'
                }
              })}
              placeholder="Enter phone number"
              error={errors.phone?.message}
              leftIcon={<FiPhone />}
            />
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                Password *
              </label>
              <Input
                type="password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Password must contain uppercase, lowercase, and number'
                  }
                })}
                placeholder="Enter password"
                error={errors.password?.message}
                leftIcon={<FiLock />}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                Confirm Password *
              </label>
              <Input
                type="password"
                {...register('confirmPassword', { 
                  required: 'Please confirm password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                placeholder="Confirm password"
                error={errors.confirmPassword?.message}
                leftIcon={<FiLock />}
              />
            </div>
          </div>

          {/* Role and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
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
            <label className="flex items-center space-x-2 text-left">
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

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
              Department
            </label>
            <Input
              {...register('department', {
                maxLength: { value: 100, message: 'Department name too long' }
              })}
              placeholder="Enter department"
              error={errors.department?.message}
              leftIcon={<FiFileText />}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
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
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
