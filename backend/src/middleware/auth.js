import { auth } from '../config/firebase.js';
import { SESSION_COOKIE_NAME } from '../config/cookies.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../utils/logger.js';

/**
 * Resolves the caller from either an `Authorization: Bearer <idToken>` header
 * (mobile apps / API clients) or the `__session` cookie (browser).
 * Revoked tokens are rejected. Returns the decoded claims, or null.
 */
const resolveUser = async (req) => {
  const header = req.headers.authorization;

  try {
    if (header?.startsWith('Bearer ')) {
      return await auth.verifyIdToken(header.slice(7), true);
    }
    const cookie = req.cookies?.[SESSION_COOKIE_NAME];
    if (cookie) {
      return await auth.verifySessionCookie(cookie, true);
    }
  } catch (error) {
    logger.warn('Token verification failed', { code: error.code ?? error.message });
  }
  return null;
};

/** Requires an authenticated user; sets req.user to the decoded token (uid, email, role, ...). */
export const requireAuth = asyncHandler(async (req, res, next) => {
  const user = await resolveUser(req);
  if (!user) throw ApiError.unauthorized('Authentication required');
  req.user = user;
  next();
});

/** Sets req.user when a valid token is present, otherwise null. Never rejects. */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  req.user = await resolveUser(req);
  next();
});

/**
 * Requires one of the given roles. Roles come from Firebase custom claims,
 * which are the source of truth for access control. Use after requireAuth.
 */
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) throw ApiError.unauthorized('Authentication required');
  if (!roles.includes(req.user.role)) {
    throw ApiError.forbidden('You do not have permission to perform this action');
  }
  next();
};

export const requireAdmin = requireRole('admin');
