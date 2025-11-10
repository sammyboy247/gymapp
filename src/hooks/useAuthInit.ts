import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth'; // Added onAuthStateChanged and User
import { authService } from '@/services/firebase/authService';
import { userService } from '@/services/firebase/userService';
import { auth } from '@/services/firebase/config'; // Keep auth for onAuthStateChanged
import { useAuthStore } from '@/store/authStore';
import type { UserProfile } from '@/types';

// Provided by Canvas environment
declare const __app_id: string | undefined; // Keep __app_id declaration as it's used in the logic
declare const __initial_auth_token: string | undefined;

export const useAuthInit = () => {
  const { setAuthReady, setUser, setUserProfile } = useAuthStore();

  useEffect(() => {
    // 1. Set App ID from global var (no longer stored in store, just used locally)
    // const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'; // Removed appId declaration

    // 2. Set up auth listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => { // Explicitly typed firebaseUser
      if (firebaseUser) {
        // User is signed in
        setUser(firebaseUser); // Set Firebase User object in store
        try {
          let userProfile = await userService.getUserProfile(firebaseUser.uid);

          if (!userProfile) {
            // New user, create a default profile
            const newProfile: UserProfile = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'New User',
              friendId: `User${Math.floor(Math.random() * 9000) + 1000}`,
              role: 'member', // Default role
              shareActivity: false,
              friends: [],
              friendRequestsSent: [],
              friendRequestsReceived: [],
            };
            await userService.createUserProfile(firebaseUser.uid, newProfile);
            userProfile = newProfile;
          }
          setUserProfile(userProfile);
        } catch (error) {
          console.error('Error fetching or creating user profile:', error);
          setUserProfile(null);
        }
      } else {
        // User is signed out
        setUser(null);
        setUserProfile(null);
      }
      // 4. Signal that auth check is complete
      setAuthReady(true);
    });

    // 5. Perform initial sign-in
    const signIn = async () => {
      if (typeof __initial_auth_token !== 'undefined' && auth.currentUser === null) {
        try {
          await authService.signInWithCustomToken(__initial_auth_token);
        } catch (error) {
          console.error('Error signing in with custom token:', error);
          // Fallback to anonymous sign-in if custom token fails
          // Note: authService.signInAnonymously() is not yet implemented,
          // so we'll rely on onAuthStateChanged to handle the null user state.
        }
      } else if (auth.currentUser === null) {
        // Fallback to anonymous sign-in if no custom token and no current user
        // Note: authService.signInAnonymously() is not yet implemented.
      }
      // onAuthStateChanged will handle the rest
    };

    signIn();

    // 6. Cleanup listener on unmount
    return () => unsubscribe();
  }, [setAuthReady, setUser, setUserProfile]);
};