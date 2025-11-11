import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export const HomePage: React.FC = () => {
  const { userProfile } = useAuthStore();
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Welcome to GymApp, {userProfile?.displayName || 'User'}!</h1>
      <p className="text-lg text-zinc-700 mb-6">
        This is your dashboard. From here you can view your schedule or manage your profile.
      </p>
      <Link 
        to="/schedule" 
        className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        View My Schedule
      </Link>
    </div>
  );
};