import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import type { UserProfile } from '@/types';

const createUserProfile = async (userId: string, profileData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...profileData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error: any) {
    // If document already exists (from parallel creation), ignore the error
    if (error?.code === 'permission-denied' || error?.message?.includes('already exists')) {
      console.log(`[userService] Profile for ${userId} already exists, skipping creation`);
      return;
    }
    // Re-throw other errors
    throw error;
  }
};

const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  console.log(`[userService] Attempting to get user profile for userId: ${userId}`);
  try {
    // Add timeout to prevent hanging indefinitely when offline
    const timeoutPromise = new Promise<null>((_, reject) => {
      setTimeout(() => reject(new Error('getUserProfile timeout after 5s')), 5000);
    });

    const getDocPromise = getDoc(doc(db, 'users', userId));

    const userDoc = await Promise.race([getDocPromise, timeoutPromise]) as any;

    console.log(`[userService] User profile for ${userId} exists: ${userDoc?.exists?.() || false}`);
    if (userDoc && userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as UserProfile;
    }
  } catch (error) {
    console.error(`[userService] Error fetching user profile for ${userId}:`, error);
  }
  console.log(`[userService] Returning null for ${userId}`);
  return null;
};

const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<void> => {
  await updateDoc(doc(db, 'users', userId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

const searchByFriendId = async (friendId: string): Promise<UserProfile | null> => {
    const q = query(collection(db, "users"), where("friendId", "==", friendId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() } as UserProfile;
    }
    return null;
}

import type { ProgramAssignment } from '@/types';

const getUserPrograms = async (userId: string): Promise<ProgramAssignment[]> => {
  const q = query(collection(db, 'programAssignments'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProgramAssignment));
};

const searchUsers = async (searchTerm: string): Promise<UserProfile[]> => {
  // Note: Firestore doesn't support full-text search natively
  // This is a simple implementation that fetches all users and filters in memory
  // For production, consider using Algolia or similar service for better search
  const querySnapshot = await getDocs(collection(db, 'users'));
  const allUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile));

  const lowerSearchTerm = searchTerm.toLowerCase();
  return allUsers.filter(user =>
    user.displayName?.toLowerCase().includes(lowerSearchTerm) ||
    user.email?.toLowerCase().includes(lowerSearchTerm)
  );
};

const updateActivitySharing = async (userId: string, shareActivity: boolean): Promise<void> => {
  await updateUserProfile(userId, { shareActivity });
};

const updateDisplayName = async (userId: string, displayName: string): Promise<void> => {
  await updateUserProfile(userId, { displayName });
};

const getAllUsers = async (): Promise<UserProfile[]> => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile));
};

export const userService = {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  searchByFriendId,
  getUserPrograms,
  searchUsers,
  updateActivitySharing,
  updateDisplayName,
  getAllUsers,
};