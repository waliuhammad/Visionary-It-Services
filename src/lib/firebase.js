import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase Web app config (public identifiers, not secrets), read from .env / .env.production.
// Firebase Console -> Project settings -> General -> Your apps
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

if (!firebaseConfig.apiKey) {
  console.error('Firebase config missing: copy .env.example to .env and fill in the VITE_FIREBASE_* values.');
}

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
