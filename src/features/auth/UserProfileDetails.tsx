import React from 'react';
import { useAuthStore } from '@/store/authStore';

export const UserProfileDetails: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">My Details</h2>
      <p><strong>Name:</strong> {user.realName}</p>
      <p><strong>Email:</strong> {user.email || 'Not provided'}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p className="mt-4 p-3 bg-zinc-100 rounded">
        <strong>My Public Friend ID:</strong> 
        <span className="font-mono text-blue-600 ml-2">{user.friendId}</span>
      </p>
      <p className="text-sm text-zinc-600 mt-2">Share this ID with friends to connect.</p>
    </div>
  );
};