/**
 * Utility script to update test account roles in Firestore
 *
 * Run this from the browser console after importing:
 * 1. Open browser console on http://localhost:5173
 * 2. Run: await window.updateTestAccountRoles()
 *
 * Or run directly in development with browser tools
 */

import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/services/firebase/config';

export const updateTestAccountRoles = async () => {
  console.log('🔧 Updating test account roles...');

  const testAccounts = [
    { email: 'admin@gymapp.com', role: 'admin' },
    { email: 'coach@gymapp.com', role: 'coach' },
    { email: 'member1@gymapp.com', role: 'member' },
  ];

  let updated = 0;
  let notFound = 0;

  for (const account of testAccounts) {
    try {
      // Find user by email
      const q = query(collection(db, 'users'), where('email', '==', account.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log(`⚠️  User not found: ${account.email}`);
        notFound++;
        continue;
      }

      // Update the user's role
      const userDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, 'users', userDoc.id), {
        role: account.role,
        updatedAt: new Date(),
      });

      console.log(`✅ Updated ${account.email} to role: ${account.role}`);
      updated++;
    } catch (error) {
      console.error(`❌ Error updating ${account.email}:`, error);
    }
  }

  console.log(`\n📊 Summary: ${updated} updated, ${notFound} not found`);
  console.log('🔄 Please logout and login again to see the changes.');

  return { updated, notFound };
};

// Make it available on window for browser console access
if (typeof window !== 'undefined') {
  (window as any).updateTestAccountRoles = updateTestAccountRoles;
}
