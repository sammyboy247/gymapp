import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/firebase/authService';
import { userService } from '@/services/firebase/userService';
import { AlertCircle } from 'lucide-react';
import type { UserProfile } from '@/types';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Try to sign in
      await authService.signInWithEmail(email, password);
      // onAuthStateChanged in useAuthInit will handle the rest
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);

      // If user not found, try to create account
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          console.log('User not found, creating new account...');
          const user = await authService.createUserWithEmail(email, password);

          // Create user profile with default member role
          const newProfile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'> = {
            email: email,
            displayName: email.split('@')[0],
            friendId: `User${Math.floor(Math.random() * 9000) + 1000}`,
            role: 'member', // Default to member, can be changed in Firebase console
            shareActivity: false,
            friends: [],
            friendRequestsSent: [],
            friendRequestsReceived: [],
          };

          await userService.createUserProfile(user.uid, newProfile);
          console.log('Account created successfully');
          navigate('/');
        } catch (createErr: any) {
          console.error('Account creation error:', createErr);
          setError('Failed to create account. Please try again.');
        }
      } else {
        // User-friendly error messages
        switch (err.code) {
          case 'auth/invalid-email':
            setError('Invalid email address.');
            break;
          case 'auth/user-disabled':
            setError('This account has been disabled.');
            break;
          case 'auth/wrong-password':
            setError('Incorrect password.');
            break;
          case 'auth/weak-password':
            setError('Password is too weak. Use at least 6 characters.');
            break;
          default:
            setError('Failed to sign in. Please try again.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillTestCredentials = (role: 'admin' | 'coach' | 'member') => {
    const credentials = {
      admin: { email: 'admin@gymapp.com', password: 'Admin123!' },
      coach: { email: 'coach@gymapp.com', password: 'Coach123!' },
      member: { email: 'member1@gymapp.com', password: 'Member123!' },
    };

    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">GymApp</h1>
        <p className="text-center text-zinc-600 mb-6">Sign in to continue</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors font-medium"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3 text-center">Quick Login (Test Accounts):</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => fillTestCredentials('admin')}
              className="text-xs py-2 px-3 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
            >
              Admin
            </button>
            <button
              onClick={() => fillTestCredentials('coach')}
              className="text-xs py-2 px-3 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
            >
              Coach
            </button>
            <button
              onClick={() => fillTestCredentials('member')}
              className="text-xs py-2 px-3 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              Member
            </button>
          </div>
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
            <strong>First-time setup:</strong> Test accounts will be created automatically with "member" role.
            To test admin/coach features, update the role field in Firebase Console &gt; Firestore &gt; users collection.
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            You can also create new accounts by entering any email/password and signing in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
