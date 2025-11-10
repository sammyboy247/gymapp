import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  allowedRoles?: Array<'member' | 'admin' | 'coach'>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, userProfile, authReady } = useAuthStore();
  const isAuthenticated = !!user; // Derive isAuthenticated from user

  if (!authReady) { // Use authReady
    // Show loading spinner while auth state is being determined
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && userProfile?.role && !allowedRoles.includes(userProfile.role)) { // Use userProfile.role
    // User is authenticated but not authorized for this route
    return <Navigate to="/schedule" replace />;
  }

  return <Outlet />;
};