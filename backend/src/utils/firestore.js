/**
 * Utility to run Firestore queries with retry logic or batch operations.
 */
import { db } from '../config/firebase.js';

export const firestore = {
  /**
   * Run a transaction with retry logic.
   * @param {Function} updateFunction The transaction function.
   * @returns {Promise<any>}
   */
  runTransaction: async (updateFunction) => {
    return db.runTransaction(updateFunction);
  },
  
  /**
   * Helper to write documents in batches of 500 (Firestore limit).
   * @param {Array} items Array of items to write.
   * @param {Function} actionFn Function that takes (batch, item) and adds the operation to the batch.
   * @returns {Promise<void>}
   */
  processInBatches: async (items, actionFn) => {
    const BATCH_SIZE = 450; // Use 450 to be safe
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const chunk = items.slice(i, i + BATCH_SIZE);
      const batch = db.batch();
      
      for (const item of chunk) {
        actionFn(batch, item);
      }
      
      await batch.commit();
    }
  }
};
