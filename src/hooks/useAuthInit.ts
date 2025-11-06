import { useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/services/firebase';
import { useAuthStore } from '@/store/authStore';
import type { UserProfile } from '@/types';

// Provided by Canvas environment
declare const __app_id: string | undefined;
declare const __initial_auth_token: string | undefined;

export const useAuthInit = () => {
  const { setAuthReady, setUser, setAppId, setUserId } = useAuthStore();

  useEffect(() => {
    // 1. Set App ID from global var
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    setAppId(appId);

    // 2. Set up auth listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setUserId(firebaseUser.uid);
        const userRef = doc(db, `artifacts/${appId}/users/${firebaseUser.uid}/profile/main`);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          // 3a. User profile exists, load it
          setUser(userSnap.data() as UserProfile);
        } else {
          // 3b. New user, create a default profile
          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            realName: firebaseUser.email || 'New User',
            friendId: `User${Math.floor(Math.random() * 9000) + 1000}`,
            role: 'member', // Default role
          };
          await setDoc(userRef, newProfile);
          setUser(newProfile);
        }
      } else {
        // User is signed out
        setUser(null);
        setUserId(null);
      }
      // 4. Signal that auth check is complete
      setAuthReady(true);
    });

    // 5. Perform initial sign-in
    const signIn = async () => {
      if (typeof __initial_auth_token !== 'undefined' && auth.currentUser === null) {
        try {
          await signInWithCustomToken(auth, __initial_auth_token);
        } catch (error) {
          console.error('Error signing in with custom token:', error);
          await signInAnonymously(auth); // Fallback
        }
      } else if (auth.currentUser === null) {
        await signInAnonymously(auth);
      }
      // onAuthStateChanged will handle the rest
    };

    signIn();

    // 6. Cleanup listener on unmount
    return () => unsubscribe();
  }, [setAuthReady, setUser, setAppId, setUserId]);
};