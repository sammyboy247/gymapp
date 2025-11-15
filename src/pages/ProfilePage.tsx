import React from 'react';
import { FriendManager } from '@/features/social/components/FriendManager';
import { UserProfileDetails } from '@/features/auth/UserProfileDetails';
import { MyPrograms } from '@/features/profile/MyPrograms';
import { PrivacySettings } from '@/features/profile/PrivacySettings';

const ProfilePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <UserProfileDetails />
          <PrivacySettings />
          <FriendManager />
        </div>
        <div>
          <MyPrograms />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;