/**
 * User Profile Component
 * Comprehensive user profile management page
 */

import React, { useState, useEffect } from 'react';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiEdit3, 
  FiSave, FiX, FiCamera, FiLock, FiActivity, FiSettings,
  FiGlobe, FiBell, FiShield, FiUpload
} from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../services/mockUserData';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { showToast } from '../../components/ui/Toast';
import { AvatarSection, SecuritySection, PreferencesSection, ActivitySection } from './ProfileSections';

// Profile sections
const PROFILE_SECTIONS = {
  PERSONAL: 'personal',
  AVATAR: 'avatar', 
  SECURITY: 'security',
  PREFERENCES: 'preferences',
  ACTIVITY: 'activity'
};

const UserProfile = () => {
  const { user: currentUser, updateUser } = useAuth();
  const [activeSection, setActiveSection] = useState(PROFILE_SECTIONS.PERSONAL);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [activityLog, setActivityLog] = useState([]);

  // Form for profile editing
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch
  } = useForm();

  // Form for password change
  const {
    register: passwordRegister,
    handleSubmit: handlePasswordSubmit,
    reset: passwordReset,
    formState: { errors: passwordErrors },
    watch: passwordWatch
  } = useForm();

  const newPassword = passwordWatch('newPassword');

  // Load user profile data
  useEffect(() => {
    loadUserProfile();
    loadActivityLog();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      
      if (!currentUser?.id) {
        throw new Error('No current user ID available');
      }
      
      const profile = await userAPI.getUser(currentUser.id);
      setUserProfile(profile);
      setAvatarPreview(profile.avatar);
      
      // Populate form with current data
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone || '',
        bio: profile.bio || '',
        department: profile.department || '',
        timezone: profile.timezone || 'UTC',
        language: profile.language || 'en',
        theme: profile.preferences?.theme || 'system',
        emailNotifications: profile.preferences?.notifications?.email || false,
        pushNotifications: profile.preferences?.notifications?.push || false,
        newPostsNotifications: profile.preferences?.notifications?.newPosts || false,
        commentsNotifications: profile.preferences?.notifications?.comments || false
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
      showToast.error(`Error loading profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadActivityLog = async () => {
    try {
      // Mock activity log - in real app this would be an API call
      const mockActivity = [
        {
          id: '1',
          action: 'profile_update',
          details: { field: 'bio' },
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          ipAddress: '192.168.1.1'
        },
        {
          id: '2', 
          action: 'login',
          details: {},
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          ipAddress: '192.168.1.1'
        },
        {
          id: '3',
          action: 'password_change',
          details: {},
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          ipAddress: '192.168.1.2'
        },
        {
          id: '4',
          action: 'avatar_update',
          details: {},
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          ipAddress: '192.168.1.1'
        }
      ];
      setActivityLog(mockActivity);
    } catch (error) {
      console.error('Error loading activity log:', error);
    }
  };

  // Handle avatar upload
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
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile update
  const onSubmitProfile = async (data) => {
    try {
      setLoading(true);
      
      const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        bio: data.bio,
        department: data.department,
        timezone: data.timezone,
        language: data.language,
        avatar: avatarPreview,
        preferences: {
          theme: data.theme,
          notifications: {
            email: data.emailNotifications,
            push: data.pushNotifications,
            newPosts: data.newPostsNotifications,
            comments: data.commentsNotifications
          }
        }
      };

      const updatedUser = await userAPI.updateUser(currentUser.id, updateData);
      setUserProfile(updatedUser);
      updateUser(updatedUser);
      setIsEditing(false);
      showToast.success('Profile updated successfully!');
      loadActivityLog(); // Refresh activity log
    } catch (error) {
      showToast.error(`Error updating profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const onSubmitPassword = async (data) => {
    try {
      setLoading(true);
      
      if (data.newPassword !== data.confirmPassword) {
        showToast.error('New passwords do not match');
        return;
      }

      // Mock password change - in real app this would validate current password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      passwordReset();
      showToast.success('Password changed successfully!');
      loadActivityLog(); // Refresh activity log
    } catch (error) {
      showToast.error(`Error changing password: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Section navigation
  const sections = [
    { key: PROFILE_SECTIONS.PERSONAL, label: 'Personal Info', icon: FiUser },
    { key: PROFILE_SECTIONS.AVATAR, label: 'Avatar & Media', icon: FiCamera },
    { key: PROFILE_SECTIONS.SECURITY, label: 'Security', icon: FiShield },
    { key: PROFILE_SECTIONS.PREFERENCES, label: 'Preferences', icon: FiSettings },
    { key: PROFILE_SECTIONS.ACTIVITY, label: 'Activity Log', icon: FiActivity }
  ];

  // Format activity log items
  const formatActivity = (activity) => {
    const actions = {
      login: { label: 'Logged in', icon: '🔓', color: 'text-green-600' },
      logout: { label: 'Logged out', icon: '🔒', color: 'text-gray-600' },
      profile_update: { label: 'Updated profile', icon: '✏️', color: 'text-blue-600' },
      password_change: { label: 'Changed password', icon: '🔑', color: 'text-orange-600' },
      avatar_update: { label: 'Updated avatar', icon: '📷', color: 'text-purple-600' }
    };
    return actions[activity.action] || { label: activity.action, icon: '📝', color: 'text-gray-600' };
  };

  if (loading && !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400">Unable to load profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your personal information and preferences
              </p>
            </div>
            {activeSection === PROFILE_SECTIONS.PERSONAL && (
              <div className="flex items-center space-x-3">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    <FiEdit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        reset();
                        setAvatarPreview(userProfile.avatar);
                      }}
                    >
                      <FiX className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit(onSubmitProfile)}
                      loading={loading}
                    >
                      <FiSave className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <Card className="p-4">
              <nav className="space-y-1">
                {sections.map(section => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.key}
                      onClick={() => setActiveSection(section.key)}
                      className={`
                        w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                        ${activeSection === section.key
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {section.label}
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeSection === PROFILE_SECTIONS.PERSONAL && (
              <PersonalInfoSection 
                userProfile={userProfile}
                isEditing={isEditing}
                register={register}
                errors={errors}
                avatarPreview={avatarPreview}
                handleAvatarChange={handleAvatarChange}
              />
            )}

            {activeSection === PROFILE_SECTIONS.AVATAR && (
              <AvatarSection 
                userProfile={userProfile}
                avatarPreview={avatarPreview}
                handleAvatarChange={handleAvatarChange}
                onSave={handleSubmit(onSubmitProfile)}
                loading={loading}
              />
            )}

            {activeSection === PROFILE_SECTIONS.SECURITY && (
              <SecuritySection 
                passwordRegister={passwordRegister}
                passwordErrors={passwordErrors}
                onSubmitPassword={handlePasswordSubmit(onSubmitPassword)}
                loading={loading}
                newPassword={newPassword}
              />
            )}

            {activeSection === PROFILE_SECTIONS.PREFERENCES && (
              <PreferencesSection 
                userProfile={userProfile}
                register={register}
                errors={errors}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                onSave={handleSubmit(onSubmitProfile)}
                loading={loading}
              />
            )}

            {activeSection === PROFILE_SECTIONS.ACTIVITY && (
              <ActivitySection 
                activityLog={activityLog}
                formatActivity={formatActivity}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Personal Information Section Component
const PersonalInfoSection = ({ userProfile, isEditing, register, errors, avatarPreview, handleAvatarChange }) => (
  <Card className="p-6">
    <div className="flex items-center space-x-6 mb-6">
      {/* Avatar Display */}
      <div className="relative">
        <img
          src={avatarPreview}
          alt={userProfile.displayName}
          className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${userProfile.firstName}+${userProfile.lastName}&background=random&size=96`;
          }}
        />
        {isEditing && (
          <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
            <FiCamera className="w-6 h-6 text-white" />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Basic Info */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {userProfile.displayName}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{userProfile.email}</p>
        <div className="flex items-center space-x-4 mt-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            {userProfile.role}
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            {userProfile.status}
          </Badge>
        </div>
      </div>
    </div>

    {/* Profile Form */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input
        label="First Name"
        {...register('firstName', { required: 'First name is required' })}
        error={errors.firstName?.message}
        disabled={!isEditing}
        leftIcon={<FiUser />}
      />
      
      <Input
        label="Last Name"
        {...register('lastName', { required: 'Last name is required' })}
        error={errors.lastName?.message}
        disabled={!isEditing}
        leftIcon={<FiUser />}
      />
      
      <Input
        label="Email"
        type="email"
        {...register('email')}
        disabled={true}
        leftIcon={<FiMail />}
        hint="Email cannot be changed"
      />
      
      <Input
        label="Phone"
        type="tel"
        {...register('phone', {
          pattern: {
            value: /^[\+]?[1-9][\d]{0,15}$/,
            message: 'Invalid phone number'
          }
        })}
        error={errors.phone?.message}
        disabled={!isEditing}
        leftIcon={<FiPhone />}
      />
      
      <Input
        label="Department"
        {...register('department')}
        disabled={!isEditing}
        leftIcon={<FiMapPin />}
      />
      
      <Select
        label="Timezone"
        {...register('timezone')}
        disabled={!isEditing}
      >
        <option value="UTC">UTC</option>
        <option value="America/New_York">Eastern Time</option>
        <option value="America/Chicago">Central Time</option>
        <option value="America/Denver">Mountain Time</option>
        <option value="America/Los_Angeles">Pacific Time</option>
        <option value="Europe/London">London</option>
        <option value="Europe/Paris">Paris</option>
        <option value="Asia/Tokyo">Tokyo</option>
        <option value="Asia/Shanghai">Shanghai</option>
      </Select>
    </div>

    <div className="mt-6">
      <TextArea
        label="Bio"
        {...register('bio', {
          maxLength: { value: 500, message: 'Bio must be less than 500 characters' }
        })}
        error={errors.bio?.message}
        disabled={!isEditing}
        rows={4}
        placeholder="Tell us about yourself..."
      />
    </div>

    {/* Account Info */}
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Account Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <FiCalendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">Member since:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {new Date(userProfile.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <FiActivity className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">Last login:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {userProfile.lastLogin ? new Date(userProfile.lastLogin).toLocaleDateString() : 'Never'}
          </span>
        </div>
      </div>
    </div>
  </Card>
);

export default UserProfile;
