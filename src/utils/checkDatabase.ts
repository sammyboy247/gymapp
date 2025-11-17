/**
 * Check which database we're connected to
 * Run: await window.checkDatabase()
 */

import { db } from '@/services/firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const checkDatabase = async () => {
  console.log('🔍 Checking database connection...');
  console.log('App name:', db.app.name);
  console.log('Project ID:', db.app.options.projectId);
  console.log('Database type:', db.type);
  console.log('Database instance:', db);

  // Check if we can get the database path
  console.log('\n📍 Database path info:');
  console.log('Full database object:', JSON.stringify({
    app: db.app.name,
    projectId: db.app.options.projectId,
    databaseId: (db as any)._databaseId?.database || '(default)'
  }, null, 2));

  console.log('\n🧪 Attempting simple write test...');
  console.log('This will try to write to: projects/' + db.app.options.projectId + '/databases/(default)/documents/test/simple');

  try {
    const testDocRef = doc(db, 'test', 'simple');

    console.log('Writing document...');
    const writePromise = setDoc(testDocRef, {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Simple connectivity test'
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Write timeout after 10s')), 10000);
    });

    await Promise.race([writePromise, timeoutPromise]);
    console.log('✅ Write successful!');

    console.log('Reading document back...');
    const docSnap = await getDoc(testDocRef);
    console.log('✅ Read successful! Data:', docSnap.data());

    return { success: true, database: (db as any)._databaseId?.database || '(default)' };
  } catch (error: any) {
    console.error('❌ Test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);

    if (error.code === 'permission-denied') {
      console.error('\n🚫 PERMISSION DENIED');
      console.error('This means:');
      console.error('1. Rules were not published correctly, OR');
      console.error('2. Rules are published but blocking this write, OR');
      console.error('3. You are not authenticated');
    } else if (error.message.includes('timeout')) {
      console.error('\n⏱️ TIMEOUT');
      console.error('This means:');
      console.error('1. Database might not exist, OR');
      console.error('2. Network connectivity issue, OR');
      console.error('3. Wrong database name in config');
    }

    return { success: false, error, database: (db as any)._databaseId?.database || '(default)' };
  }
};

// Make available on window
if (typeof window !== 'undefined') {
  (window as any).checkDatabase = checkDatabase;
}
