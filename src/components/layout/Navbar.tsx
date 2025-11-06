import React from 'react';  
import { Link } from 'react-router-dom';  
import { useAuthStore } from '@/store/authStore';  
import { LogOut, User, LayoutDashboard, Calendar } from 'lucide-react';

export const Navbar: React.FC = () => {  
  const { isAuthenticated, user } = useAuthStore();

  return (  
    <nav className="bg-white shadow-md">  
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">  
        <Link to="/" className="text-2xl font-bold text-zinc-800">  
          GymApp  
        </Link>  
        <div className="flex items-center space-x-4">  
          {isAuthenticated ? (  
            <>  
              <Link to="/schedule" className="flex items-center text-zinc-600 hover:text-blue-600">  
                <Calendar className="w-5 h-5 mr-1" /> Schedule  
              </Link>  
              {user?.role === 'admin' && (  
                <Link to="/admin" className="flex items-center text-zinc-600 hover:text-blue-600">  
                  <LayoutDashboard className="w-5 h-5 mr-1" /> Admin  
                </Link>  
              )}  
              <Link to="/profile" className="flex items-center text-zinc-600 hover:text-blue-600">  
                <User className="w-5 h-5 mr-1" /> Profile  
              </Link>  
              <button onClick={() => {/* Add auth.signOut() logic here */}} className="flex items-center text-red-500 hover:text-red-700">  
                <LogOut className="w-5 h-5 mr-1" /> Logout  
              </button>  
            </>  
          ) : (  
            <Link to="/login" className="text-zinc-600 hover:text-blue-600">Login</Link>  
          )}  
        </div>  
      </div>  
    </nav>  
  );  
};