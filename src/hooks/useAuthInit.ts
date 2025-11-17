import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
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
    console.log('[useAuthInit] Hook starting...');
    let isMounted = true; // Track if component is still mounted

    // 2. Set up auth listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (!isMounted) return; // Prevent updates if unmounted
      
      console.log('[useAuthInit] Auth state changed. User:', firebaseUser?.uid || 'null');
      if (firebaseUser) {
        // User is signed in
        setUser(firebaseUser);
        try {
          console.log('[useAuthInit] Fetching user profile for:', firebaseUser.uid);
          let userProfile = await userService.getUserProfile(firebaseUser.uid);

          if (!userProfile && isMounted) {
            // New user, create a default profile
            console.log('[useAuthInit] No profile found, creating new profile...');
            const newProfile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'> = {
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'New User',
              friendId: `User${Math.floor(Math.random() * 9000) + 1000}`,
              role: 'member',
              shareActivity: false,
              friends: [],
              friendRequestsSent: [],
              friendRequestsReceived: [],
            };
            
            try {
              // Add timeout to prevent hanging forever
              await Promise.race([
                userService.createUserProfile(firebaseUser.uid, newProfile),
                new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('Profile creation timeout after 8s')), 8000)
                )
              ]);
              console.log('[useAuthInit] Profile created successfully');
              // Fetch the profile to get server timestamps
              userProfile = await userService.getUserProfile(firebaseUser.uid);
            } catch (createError: any) {
              console.error('[useAuthInit] Error creating profile:', createError);
              // If creation failed, try fetching again (might have been created by parallel mount)
              userProfile = await userService.getUserProfile(firebaseUser.uid);
            }
          }
          
          if (isMounted) {
            console.log('[useAuthInit] User profile loaded:', userProfile);
            setUserProfile(userProfile);
          }
        } catch (error) {
          console.error('[useAuthInit] Error fetching or creating user profile:', error);
          if (isMounted) {
            setUserProfile(null);
          }
        }
      } else {
        // User is signed out
        console.log('[useAuthInit] No user signed in');
        if (isMounted) {
          setUser(null);
          setUserProfile(null);
        }
      }
      // 4. Signal that auth check is complete
      if (isMounted) {
        console.log('[useAuthInit] Setting authReady to true');
        setAuthReady(true);
      }
    });

    // 5. Perform initial sign-in (Canvas token only)
    const signIn = async () => {
      if (!isMounted) return;

      console.log('[useAuthInit] signIn() called. Current user:', auth.currentUser?.uid || 'null');
      console.log('[useAuthInit] Canvas token available?', typeof __initial_auth_token !== 'undefined');

      // Only auto-sign-in if Canvas token is available
      if (typeof __initial_auth_token !== 'undefined' && auth.currentUser === null) {
        console.log('[useAuthInit] Attempting custom token sign-in...');
        try {
          await authService.signInWithToken(__initial_auth_token);
          console.log('[useAuthInit] Custom token sign-in successful');
        } catch (error) {
          console.error('[useAuthInit] Error signing in with custom token:', error);
          console.log('[useAuthInit] Canvas token failed. User must sign in via LoginPage.');
        }
      } else if (auth.currentUser === null) {
        // No Canvas token and no current user - user must sign in via LoginPage
        console.log('[useAuthInit] No Canvas token. User must authenticate via LoginPage.');
      } else {
        console.log('[useAuthInit] User already signed in:', auth.currentUser.uid);
      }
    };

    signIn();

    // 6. Cleanup listener on unmount
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [setAuthReady, setUser, setUserProfile]);
};