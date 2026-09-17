import { auth } from '../config/firebase.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../utils/logger.js';

/**
 * Extracts the ID token or Session Cookie from the request.
 */
const extractToken = (req) => {
  if (req.headers.authorization?.startsWith('Bearer ')) {
    return req.headers.authorization.split('Bearer ')[1];
  }
  if (req.cookies?.__session) {
    return req.cookies.__session;
  }
  return null;
};

/**
 * Verifies the token and attaches the decoded user to req.user.
 * This is used internally by the auth middlewares.
 */
const verifyAndAttachUser = async (req) => {
  const token = extractToken(req);
  if (!token) return null;

  try {
    // If it's a session cookie (JWT from createSessionCookie)
    if (req.cookies?.__session && token === req.cookies.__session) {
      const decodedCookie = await auth.verifySessionCookie(token, true);
      return decodedCookie;
    }
    
    // Otherwise it's an ID token
    const decodedToken = await auth.verifyIdToken(token, true);
    return decodedToken;
  } catch (error) {
    logger.warn('Token verification failed', { error: error.code || error.message });
    return null;
  }
};

/**
 * Middleware: Requires the user to be authenticated.
 */
export const requireAuth = asyncHandler(async (req, res, next) => {
  const user = await verifyAndAttachUser(req);
  if (!user) {
    throw ApiError.unauthorized('Authentication required');
  }
  req.user = user;
  next();
});

/**
 * Middleware: Attaches the user to req.user if authenticated, but does not reject if not.
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const user = await verifyAndAttachUser(req);
  req.user = user || null;
  next();
});

/**
 * Middleware: Requires the user to have one of the specified roles.
 * Must be used after requireAuth.
 */
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    throw ApiError.unauthorized('Authentication required');
  }
  
  if (!req.user.role || !roles.includes(req.user.role)) {
    throw ApiError.forbidden(`Requires one of roles: ${roles.join(', ')}`);
  }
  
  next();
};

/**
 * Middleware: Requires the user to be an admin.
 * Must be used after requireAuth.
 */
export const requireAdmin = requireRole('admin');
