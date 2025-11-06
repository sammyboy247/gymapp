import React from 'react';
import { FriendManager } from '@/features/social/components/FriendManager';
import { UserProfileDetails } from '@/features/auth/UserProfileDetails';

export const ProfilePage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="space-y-8">
        <UserProfileDetails />
        <FriendManager />
      </div>
    </div>
  );
};