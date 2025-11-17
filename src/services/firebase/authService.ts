import type { User } from 'firebase/auth';
import {
  signInWithCustomToken,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from './config';

const signInWithToken = async (token: string): Promise<User> => {
  const userCredential = await signInWithCustomToken(auth, token);
  return userCredential.user;
};

const signInAnonymous = async (): Promise<User> => {
  const userCredential = await signInAnonymously(auth);
  return userCredential.user;
};

const signInWithEmail = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

const createUserWithEmail = async (email: string, password: string): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
  signInAnonymous,
  signInWithEmail,
  createUserWithEmail,
  signOut,
  getCurrentUser,
};