import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log('[Firebase Config] Initializing with config:', {
  apiKey: firebaseConfig.apiKey ? 'present' : 'MISSING',
  authDomain: firebaseConfig.authDomain || 'MISSING',
  projectId: firebaseConfig.projectId || 'MISSING',
  appId: firebaseConfig.appId ? 'present' : 'MISSING'
});

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Connect to the gym-app-main database instead of (default)
export const db = getFirestore(app, 'gym-app-main');

// Enable offline persistence (helps with offline/slow connections)
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('[Firebase Config] Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('[Firebase Config] The current browser does not support offline persistence');
  } else {
    console.error('[Firebase Config] Error enabling persistence:', err);
  }
});

console.log('[Firebase Config] Firestore DB initialized:', db);
console.log('[Firebase Config] Auth initialized:', auth);