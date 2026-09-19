import { auth, usersRef } from '../../config/firebase.js';
import { SESSION_DURATION_MS } from '../../config/cookies.js';
import { ApiError } from '../../utils/ApiError.js';
import { logger } from '../../utils/logger.js';

// ID tokens older than this cannot be exchanged for a session cookie
const MAX_SIGN_IN_AGE_SECONDS = 5 * 60;

const now = () => new Date().toISOString();

/**
 * Create the Firestore profile for an existing Firebase Auth user.
 * Used for users created outside the API (Firebase Console, Google sign-in, ...).
 */
const createProfileFromAuth = async (userRecord) => {
  const profile = {
    uid: userRecord.uid,
    fullName: userRecord.displayName || userRecord.email?.split('@')[0] || '',
    email: userRecord.email || null,
    role: userRecord.customClaims?.role || 'customer',
    emailVerified: userRecord.emailVerified,
    createdAt: userRecord.metadata.creationTime
      ? new Date(userRecord.metadata.creationTime).toISOString()
      : now(),
    updatedAt: now(),
  };
  await usersRef.doc(userRecord.uid).set(profile, { merge: true });
  return profile;
};

export const authService = {
  /**
   * Register a new customer in Firebase Auth and mirror the profile to Firestore.
   * The client should then sign in with the Firebase Web SDK and call POST /auth/session.
   */
  register: async ({ email, password, fullName }) => {
    const userRecord = await auth.createUser({ email, password, displayName: fullName });
    const { uid } = userRecord;

    try {
      await auth.setCustomUserClaims(uid, { role: 'customer' });
      await usersRef.doc(uid).set({
        uid,
        fullName,
        email,
        role: 'customer',
        emailVerified: false,
        createdAt: now(),
        updatedAt: now(),
      });
    } catch (error) {
      // Roll back so the email can be used again
      await auth.deleteUser(uid).catch(() => {});
      throw error;
    }

    logger.info('User registered', { uid });
    return { uid, email, fullName, role: 'customer' };
  },

  /**
   * Exchange a freshly issued ID token for a long-lived session cookie.
   */
  createSession: async (idToken) => {
    const decoded = await auth.verifyIdToken(idToken, true);

    if (Date.now() / 1000 - decoded.auth_time > MAX_SIGN_IN_AGE_SECONDS) {
      throw ApiError.unauthorized('Recent sign-in required');
    }

    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: SESSION_DURATION_MS });
    return { sessionCookie, uid: decoded.uid, role: decoded.role || 'customer', email: decoded.email, name: decoded.name };
  },

  /**
   * Revoke all refresh tokens / sessions for a user (signs them out everywhere).
   */
  revokeTokens: async (uid) => {
    await auth.revokeRefreshTokens(uid);
    logger.info('Tokens revoked', { uid });
  },

  /**
   * Current user's profile. The role is taken from the verified token claims,
   * which is authoritative; the Firestore copy is only a mirror for querying.
   */
  getMe: async (decodedToken) => {
    const { uid } = decodedToken;
    const doc = await usersRef.doc(uid).get();
    const profile = doc.exists ? doc.data() : await createProfileFromAuth(await auth.getUser(uid));

    return {
      ...profile,
      uid,
      role: decodedToken.role || 'customer',
      emailVerified: decodedToken.email_verified ?? profile.emailVerified ?? false,
    };
  },

  /**
   * Generate a password reset link. Returns null for unknown emails so the
   * endpoint response never reveals whether an account exists.
   */
  generatePasswordReset: async (email) => {
    try {
      // Checked first: for an unknown address Firebase can fail with an unhelpful
      // internal error instead of auth/user-not-found
      await auth.getUserByEmail(email);
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/email-not-found') return null;
      throw error;
    }

    try {
      return await auth.generatePasswordResetLink(email);
    } catch (error) {
      // Never surface the reason: the response must look the same for every address
      logger.error('Could not create password reset link', { error: error.message });
      return null;
    }
  },

  /**
   * Update a user's role (admin only).
   */
  setRole: async (uid, role, actorUid) => {
    if (uid === actorUid && role !== 'admin') {
      throw ApiError.badRequest('You cannot remove your own admin role');
    }

    const userRecord = await auth.getUser(uid);

    await auth.setCustomUserClaims(uid, { ...userRecord.customClaims, role });
    await usersRef.doc(uid).set({ role, updatedAt: now() }, { merge: true });
    // Force the user to re-authenticate so their token carries the new claim
    await auth.revokeRefreshTokens(uid);

    logger.info('User role updated', { uid, role, by: actorUid });
    return { uid, role, email: userRecord.email };
  },
};
