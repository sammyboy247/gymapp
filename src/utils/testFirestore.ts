/**
 * Firestore connectivity test
 * Run this from browser console: await window.testFirestore()
 */

import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';
import { db } from '@/services/firebase/config';

export const testFirestore = async () => {
  console.log('🔥 Testing Firestore connectivity...');
  console.log('Database instance:', db);
  console.log('Database app:', db.app.name);
  console.log('Project ID:', db.app.options.projectId);

  try {
    // Test 1: Try to read from a collection (doesn't require write permissions)
    console.log('\n📖 Test 1: Reading from users collection...');
    const usersRef = collection(db, 'users');
    const q = query(usersRef, limit(1));
    const snapshot = await getDocs(q);
    console.log('✅ Read successful. Documents found:', snapshot.size);

    // Test 2: Try to write a test document with timeout
    console.log('\n✍️ Test 2: Writing test document...');
    const testRef = collection(db, 'test_connection');

    const writePromise = addDoc(testRef, {
      test: true,
      timestamp: new Date(),
      message: 'Connectivity test'
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Write operation timeout after 10s')), 10000);
    });

    const docRef = await Promise.race([writePromise, timeoutPromise]) as any;
    console.log('✅ Write successful. Document ID:', docRef.id);

    console.log('\n✨ All tests passed! Firestore is working correctly.');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Firestore test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);

    if (error.code === 'permission-denied') {
      console.error('🚫 Permission denied - check Firestore rules');
    } else if (error.code === 'unavailable') {
      console.error('🌐 Network error - check internet connection');
    }

    return { success: false, error };
  }
};

// Make available on window
if (typeof window !== 'undefined') {
  (window as any).testFirestore = testFirestore;
}
