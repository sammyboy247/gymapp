import { Auth, signInWithCustomToken, signOut, User } from 'firebase/auth';
import { auth } from './config';

interface AuthService {
  signInWithCustomToken: (token: string) => Promise<User | null>;
  signOut: () => Promise<void>;
  getCurrentUser: () => User | null;
}

export const authService: AuthService = {
  signInWithCustomToken: async (token: string) => {
    try {
      const userCredential = await signInWithCustomToken(auth, token);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in with custom token:", error);
      return null;
    }
  },

  signOut: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  },

  getCurrentUser: () => {
    return auth.currentUser;
  },
};
