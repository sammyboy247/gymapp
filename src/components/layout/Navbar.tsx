import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LogOut, User, LayoutDashboard, Calendar, Users, Menu, X } from 'lucide-react';
import { authService } from '@/services/firebase/authService';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile, logout } = useAuthStore();
  const isAuthenticated = !!user; // Derive isAuthenticated from user
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      logout(); // Clear store
      setMobileMenuOpen(false); // Close mobile menu on logout
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'coach':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'member':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl sm:text-2xl font-bold text-zinc-800">
            GymApp
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/schedule" className="flex items-center text-zinc-600 hover:text-blue-600">
                  <Calendar className="w-5 h-5 mr-1" /> Schedule
                </Link>
                <Link to="/social" className="flex items-center text-zinc-600 hover:text-blue-600">
                  <Users className="w-5 h-5 mr-1" /> Friends
                </Link>
                {userProfile?.role === 'admin' && (
                  <Link to="/admin" className="flex items-center text-zinc-600 hover:text-blue-600">
                    <LayoutDashboard className="w-5 h-5 mr-1" /> Admin
                  </Link>
                )}
                <Link to="/profile" className="flex items-center text-zinc-600 hover:text-blue-600">
                  <User className="w-5 h-5 mr-1" /> Profile
                </Link>

                {/* User Info Display */}
                {userProfile && (
                  <div className="flex items-center px-3 py-1.5 border-l border-gray-300 ml-2">
                    <div className="flex flex-col items-end mr-3">
                      <span className="text-sm font-semibold text-zinc-800">
                        {userProfile.displayName}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getRoleBadgeColor(userProfile.role)}`}>
                        {userProfile.role}
                      </span>
                    </div>
                    <User className="w-6 h-6 text-zinc-500" />
                  </div>
                )}

                <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-700">
                  <LogOut className="w-5 h-5 mr-1" /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="text-zinc-600 hover:text-blue-600">Login</Link>
            )}
          </div>

          {/* Mobile: User Info + Menu Button */}
          {isAuthenticated && (
            <div className="md:hidden flex items-center space-x-3">
              {userProfile && (
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-zinc-800">
                    {userProfile.displayName}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full border ${getRoleBadgeColor(userProfile.role)}`}>
                    {userProfile.role}
                  </span>
                </div>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-zinc-600 hover:text-blue-600"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {isAuthenticated && mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/schedule"
                onClick={closeMobileMenu}
                className="flex items-center text-zinc-600 hover:text-blue-600 py-2"
              >
                <Calendar className="w-5 h-5 mr-2" /> Schedule
              </Link>
              <Link
                to="/social"
                onClick={closeMobileMenu}
                className="flex items-center text-zinc-600 hover:text-blue-600 py-2"
              >
                <Users className="w-5 h-5 mr-2" /> Friends
              </Link>
              {userProfile?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  className="flex items-center text-zinc-600 hover:text-blue-600 py-2"
                >
                  <LayoutDashboard className="w-5 h-5 mr-2" /> Admin
                </Link>
              )}
              <Link
                to="/profile"
                onClick={closeMobileMenu}
                className="flex items-center text-zinc-600 hover:text-blue-600 py-2"
              >
                <User className="w-5 h-5 mr-2" /> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-red-500 hover:text-red-700 py-2 text-left"
              >
                <LogOut className="w-5 h-5 mr-2" /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};