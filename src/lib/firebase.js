import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase Web app config. These are public identifiers, not secrets: they are
// embedded in the built JavaScript of every Firebase site. Access is controlled by
// Firebase Authentication and the Firestore rules, not by hiding these values.
//
// The defaults point at the live project, so a fresh clone runs without extra setup.
// To use a different Firebase project, set the VITE_FIREBASE_* variables in .env.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBXxC1tctO0N1ZYzXFER5fubq3dI9nqEfU',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'visionaryitservices-a0c6e.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'visionaryitservices-a0c6e',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'visionaryitservices-a0c6e.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '872422670394',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:872422670394:web:01ccf6b25872634b19b503',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-4Y4H5XVSC0',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google Analytics: production only, loaded lazily so it stays out of the main bundle
if (import.meta.env.PROD && firebaseConfig.measurementId) {
  import('firebase/analytics')
    .then(async ({ getAnalytics, isSupported }) => {
      if (await isSupported()) getAnalytics(app);
    })
    .catch(() => {});
}
