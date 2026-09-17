import { usersRef, auth } from '../../config/firebase.js';
import { ApiError } from '../../utils/ApiError.js';
import { logger } from '../../utils/logger.js';

export const usersService = {
  getMe: async (uid) => {
    const doc = await usersRef.doc(uid).get();
    if (!doc.exists) throw ApiError.notFound('User not found');
    return doc.data();
  },

  updateMe: async (uid, data) => {
    const docRef = usersRef.doc(uid);
    const doc = await docRef.get();
    if (!doc.exists) throw ApiError.notFound('User not found');

    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    await docRef.update(updateData);
    
    // Also update Firebase Auth display name if fullName changed
    if (data.fullName) {
      await auth.updateUser(uid, { displayName: data.fullName });
    }
    
    logger.info('User updated profile', { uid });
    
    return (await docRef.get()).data();
  },

  findAll: async () => {
    const snapshot = await usersRef.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => doc.data());
  },

  delete: async (uid) => {
    // 1. Delete from Firebase Auth
    try {
      await auth.deleteUser(uid);
    } catch (error) {
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }
    
    // 2. Delete from Firestore
    await usersRef.doc(uid).delete();
    
    logger.info('User deleted by admin', { uid });
  }
};
