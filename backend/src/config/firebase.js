import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let app;

try {
  if (env.GOOGLE_APPLICATION_CREDENTIALS) {
    const keyPath = path.resolve(env.GOOGLE_APPLICATION_CREDENTIALS);
    // A service-account key file is loaded with cert() so tokens are signed locally;
    // anything else (e.g. workload identity config) goes through application default credentials.
    const key = existsSync(keyPath) ? JSON.parse(readFileSync(keyPath, 'utf8')) : null;
    app = initializeApp({
      credential: key?.type === 'service_account' ? cert(key) : applicationDefault(),
      projectId: key?.project_id || env.FIREBASE_PROJECT_ID,
    });
    logger.info('Firebase Admin initialized from GOOGLE_APPLICATION_CREDENTIALS');
  } else {
    app = initializeApp({
      credential: cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    logger.info('Firebase Admin initialized with inline credentials');
  }
} catch (error) {
  console.error(`❌ Failed to initialize Firebase Admin SDK — check your credentials in .env: ${error.message}`);
  process.exit(1);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export { FieldValue, FieldPath } from 'firebase-admin/firestore';

// Collection handles
export const productsRef = db.collection('products');
export const categoriesRef = db.collection('categories');
export const ordersRef = db.collection('orders');
export const usersRef = db.collection('users');
export const contactMessagesRef = db.collection('contactMessages');
export const newsletterSubscribersRef = db.collection('newsletterSubscribers');
export const countersRef = db.collection('counters');
export const settingsRef = db.collection('settings');
export const activityRef = db.collection('activityLog');
export const analyticsRef = db.collection('analytics');
