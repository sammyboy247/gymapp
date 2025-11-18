/**
 * Check current user's role in Firestore
 * Run in browser console: await window.checkUserRole()
 */

import { auth, db } from '@/services/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export const checkUserRole = async () => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    console.error('❌ No user is currently signed in');
    return { error: 'Not authenticated' };
  }

  console.log('🔍 Checking user role...');
  console.log('Firebase Auth UID:', currentUser.uid);
  console.log('Email:', currentUser.email);

  try {
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.error('❌ User document does not exist in Firestore');
      return { error: 'User document not found' };
    }

    const userData = userDoc.data();
    console.log('✅ User profile found:');
    console.log('Display Name:', userData?.displayName);
    console.log('Role:', userData?.role);
    console.log('Email:', userData?.email);
    console.log('Friend ID:', userData?.friendId);
    console.log('\n📄 Full user data:', JSON.stringify(userData, null, 2));

    return { success: true, userData };
  } catch (error: any) {
    console.error('❌ Error fetching user profile:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    return { error: error.message };
  }
};

// Make available on window
if (typeof window !== 'undefined') {
  (window as any).checkUserRole = checkUserRole;
}
