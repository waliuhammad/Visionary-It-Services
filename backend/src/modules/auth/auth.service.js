import { auth, usersRef, db } from '../../config/firebase.js';
import { ApiError } from '../../utils/ApiError.js';
import { logger } from '../../utils/logger.js';

export const authService = {
  /**
   * Register a new user and mirror to Firestore.
   */
  register: async ({ email, password, fullName }) => {
    // 1. Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: fullName,
    });

    const uid = userRecord.uid;

    // 2. Set custom claims (default role: customer)
    await auth.setCustomUserClaims(uid, { role: 'customer' });

    // 3. Mirror user in Firestore
    const userDoc = {
      uid,
      fullName,
      email,
      role: 'customer',
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await usersRef.doc(uid).set(userDoc);

    logger.info('User registered', { uid, email });
    return { uid, email, role: 'customer' };
  },

  /**
   * Mint a session cookie from an ID token.
   */
  createSession: async (idToken) => {
    // Verify the token
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Check if the user signed in recently (within the last 5 minutes)
    if (new Date().getTime() / 1000 - decodedToken.auth_time > 5 * 60) {
      throw ApiError.unauthorized('Recent sign-in required');
    }

    // Set session expiration to 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
    // Create the session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    
    return { sessionCookie, expiresIn };
  },

  /**
   * Revoke refresh tokens for a user.
   */
  revokeTokens: async (uid) => {
    await auth.revokeRefreshTokens(uid);
    logger.info('Tokens revoked', { uid });
  },

  /**
   * Get current user details from Firestore.
   */
  getMe: async (uid) => {
    const doc = await usersRef.doc(uid).get();
    if (!doc.exists) {
      throw ApiError.notFound('User profile not found');
    }
    return doc.data();
  },

  /**
   * Generate a password reset link.
   * Note: Usually the client Web SDK calls sendPasswordResetEmail directly,
   * but if the backend must do it, it generates a link.
   */
  generatePasswordReset: async (email) => {
    try {
      const link = await auth.generatePasswordResetLink(email);
      return link;
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Silently succeed to prevent email enumeration
        return null;
      }
      throw error;
    }
  },

  /**
   * Update a user's role (Admin only).
   */
  setRole: async (uid, role) => {
    // 1. Check if user exists
    await auth.getUser(uid);
    
    // 2. Set custom claims
    await auth.setCustomUserClaims(uid, { role });
    
    // 3. Mirror in Firestore
    await usersRef.doc(uid).update({
      role,
      updatedAt: new Date().toISOString()
    });
    
    // 4. Revoke tokens to force the user to re-authenticate and get the new claim
    await auth.revokeRefreshTokens(uid);
    
    logger.info('User role updated', { uid, role });
    return { uid, role };
  }
};
