import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/services/firebase/config';
import { AlertCircle } from 'lucide-react';

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
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged in useAuthInit will handle the rest
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);

      // User-friendly error messages
      switch (err.code) {
        case 'auth/invalid-email':
          setError('Invalid email address.');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password.');
          break;
        case 'auth/invalid-credential':
          setError('Invalid email or password.');
          break;
        default:
          setError('Failed to sign in. Please try again.');
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
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Test credentials are auto-filled when you click the buttons above
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
