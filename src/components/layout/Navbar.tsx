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
                <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-700">
                  <LogOut className="w-5 h-5 mr-1" /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="text-zinc-600 hover:text-blue-600">Login</Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          {isAuthenticated && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-600 hover:text-blue-600"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
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