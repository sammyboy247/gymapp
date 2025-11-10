import { create } from 'zustand';
import type { User } from 'firebase/auth';
import type { UserProfile } from '@/types';

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
  setUserProfile: (profile) => set({ userProfile: profile }),
  setAuthReady: (ready) => set({ authReady: ready }),
  logout: () => set({ user: null, userProfile: null }),
}));