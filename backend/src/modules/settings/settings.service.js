import { db } from '../../config/firebase.js';
import { logger } from '../../utils/logger.js';

const settingsRef = db.collection('settings').doc('site');

export const settingsService = {
  get: async () => {
    const doc = await settingsRef.get();
    if (!doc.exists) {
      // Default settings if none exist
      const defaultSettings = {
        freeShippingThreshold: 5000,
        shippingFee: 250,
        heroBanners: []
      };
      await settingsRef.set(defaultSettings);
      return defaultSettings;
    }
    return doc.data();
  },

  update: async (data) => {
    await settingsRef.set(data, { merge: true });
    logger.info('Settings updated');
    const updated = await settingsRef.get();
    return updated.data();
  }
};
