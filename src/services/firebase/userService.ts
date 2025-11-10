import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './config';
import type { UserProfile } from '@/types';

const createUserProfile = async (userId: string, profileData: Omit<UserProfile, 'id'>): Promise<void> => {
  await setDoc(doc(db, 'users', userId), profileData);
};

const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() } as UserProfile;
  }
  return null;
};

const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<void> => {
  await updateDoc(doc(db, 'users', userId), updates);
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

export const userService = {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  searchByFriendId,
};