import admin from 'firebase-admin';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let app;

try {
  if (env.GOOGLE_APPLICATION_CREDENTIALS) {
    app = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    logger.info('Firebase Admin initialized with application default credentials');
  } else {
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    logger.info('Firebase Admin initialized with inline credentials');
  }
} catch (error) {
  logger.error('Failed to initialize Firebase Admin SDK', { error });
  process.exit(1);
}

export const auth = admin.auth();
export const db = admin.firestore();

// Collection handles
export const productsRef = db.collection('products');
export const categoriesRef = db.collection('categories');
export const ordersRef = db.collection('orders');
export const usersRef = db.collection('users');
export const contactMessagesRef = db.collection('contactMessages');
export const newsletterSubscribersRef = db.collection('newsletterSubscribers');
export const countersRef = db.collection('counters');
