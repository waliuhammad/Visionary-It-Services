import { categoriesRef } from '../../config/firebase.js';
import { logger } from '../../utils/logger.js';
import { HttpError } from '../../utils/response.js';

export const categoriesService = {
  /**
   * Get all categories
   */
  findAll: async () => {
    const snapshot = await categoriesRef.orderBy('name', 'asc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  create: async (data) => {
    const docRef = await categoriesRef.add({
      ...data,
      createdAt: new Date().toISOString()
    });
    logger.info('Category created', { id: docRef.id });
    return { id: docRef.id, ...data };
  },

  delete: async (id) => {
    const docRef = categoriesRef.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new HttpError(404, 'Category not found');
    }
    await docRef.delete();
    logger.info('Category deleted', { id });
    return true;
  }
};
