import { create } from 'zustand';
import type { UserProfile } from '@/types';

interface AuthState {
  isAuthReady: boolean;
  isAuthenticated: boolean;
  user: UserProfile | null;
  appId: string; // From __app_id
  userId: string | null; // From auth.currentUser
  setAuthReady: (isReady: boolean) => void;
  setUser: (user: UserProfile | null) => void;
  setAppId: (appId: string) => void;
  setUserId: (userId: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthReady: false,
  isAuthenticated: false,
  user: null,
  appId: 'default-app-id',
  userId: null,
  setAuthReady: (isReady) => set({ isAuthReady: isReady }),
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAppId: (appId) => set({ appId }),
  setUserId: (userId) => set({ userId }),
}));