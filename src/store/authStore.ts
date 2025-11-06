import { create } from 'zustand';
import { User } from 'firebase/auth'; // Assuming Firebase User type
import { UserProfile } from '../types';

interface AuthStore {
  user: User | null;
  userProfile: UserProfile | null;
  authReady: boolean;
  setUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setAuthReady: (ready: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  userProfile: null,
  authReady: false,
  setUser: (user) => set({ user }),
  setUserProfile: (userProfile) => set({ userProfile }),
  setAuthReady: (authReady) => set({ authReady }),
  logout: () => set({ user: null, userProfile: null, authReady: false }),
}));
