import React from 'react';
import UserProfile from '../../components/profile/UserProfile';

const ProfilePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          User Profile
        </h1>
        <UserProfile />
      </div>
    </div>
  );
};

export default ProfilePage;
