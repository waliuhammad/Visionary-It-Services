import { newsletterSubscribersRef } from '../../config/firebase.js';
import { logger } from '../../utils/logger.js';

export const newsletterService = {
  subscribe: async (email) => {
    // Use email as doc ID for idempotency
    const docRef = newsletterSubscribersRef.doc(email);
    
    await docRef.set({
      email,
      status: 'subscribed',
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    logger.info('Newsletter subscribed', { email });
  },

  unsubscribe: async (email) => {
    const docRef = newsletterSubscribersRef.doc(email);
    const doc = await docRef.get();
    
    if (doc.exists) {
      await docRef.update({
        status: 'unsubscribed',
        updatedAt: new Date().toISOString()
      });
      logger.info('Newsletter unsubscribed', { email });
    }
  }
};
