import { doc, getDoc, setDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { db } from './config';
import { UserProfile } from '../../types';

interface UserService {
  createUserProfile: (uid: string, data: Partial<UserProfile>) => Promise<void>;
  getUserProfile: (uid: string) => Promise<UserProfile | null>;
  updateUserProfile: (uid: string, data: Partial<UserProfile>) => Promise<void>;
  searchByFriendId: (friendId: string) => Promise<UserProfile[]>;
}

export const userService: UserService = {
  createUserProfile: async (uid, data) => {
    const userProfileRef = doc(db, 'userProfiles', uid);
    await setDoc(userProfileRef, data, { merge: true });
  },

  getUserProfile: async (uid) => {
    const userProfileRef = doc(db, 'userProfiles', uid);
    const docSnap = await getDoc(userProfileRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  },

  updateUserProfile: async (uid, data) => {
    const userProfileRef = doc(db, 'userProfiles', uid);
    await setDoc(userProfileRef, data, { merge: true });
  },

  searchByFriendId: async (friendId) => {
    const userProfilesRef = collection(db, 'userProfiles');
    const q = query(userProfilesRef, where('friendId', '==', friendId));
    const querySnapshot = await getDocs(q);
    const profiles: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
      profiles.push(doc.data() as UserProfile);
    });
    return profiles;
  },
};
