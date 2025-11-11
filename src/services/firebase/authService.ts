import type { User } from 'firebase/auth';
import {
  signInWithCustomToken,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from './config';

const signInWithToken = async (token: string): Promise<User> => {
  const userCredential = await signInWithCustomToken(auth, token);
  return userCredential.user;
};

const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const authService = {
  signInWithToken,
  signOut,
  getCurrentUser,
};