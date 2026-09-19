import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

const AUTH_ERRORS = {
  'auth/email-already-exists': () => ApiError.conflict('Email already in use'),
  'auth/user-not-found': () => ApiError.notFound('User not found'),
  'auth/id-token-expired': () => ApiError.unauthorized('Token expired'),
  'auth/session-cookie-expired': () => ApiError.unauthorized('Session expired'),
  'auth/id-token-revoked': () => ApiError.unauthorized('Session revoked'),
  'auth/session-cookie-revoked': () => ApiError.unauthorized('Session revoked'),
  'auth/invalid-id-token': () => ApiError.unauthorized('Invalid token'),
  'auth/invalid-session-cookie': () => ApiError.unauthorized('Invalid session'),
  'auth/invalid-password': () => ApiError.badRequest('Password must be at least 6 characters'),
  'auth/invalid-email': () => ApiError.badRequest('Invalid email address'),
};

export const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Cannot find ${req.method} ${req.originalUrl}`));
};

// Express identifies error handlers by their 4-argument signature, so `next` must stay.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (err instanceof ZodError) {
    error = ApiError.unprocessable(
      'Validation failed',
      // Drop the leading "body" / "query" / "params" segment from each path
      err.issues.map((i) => ({ path: i.path.slice(1).join('.'), message: i.message }))
    );
  } else if (typeof err?.code === 'string' && err.code.startsWith('auth/')) {
    error = AUTH_ERRORS[err.code]?.() ?? ApiError.badRequest(err.message);
  } else if (err?.name === 'MulterError') {
    error = err.code === 'LIMIT_FILE_SIZE'
      ? new ApiError(413, 'Image is too large (max 5 MB)')
      : ApiError.badRequest(err.code === 'LIMIT_UNEXPECTED_FILE' ? 'Send images in the "files" field (max 10)' : err.message);
  } else if (err?.type === 'entity.parse.failed') {
    error = ApiError.badRequest('Malformed JSON body');
  } else if (err?.type === 'entity.too.large') {
    error = new ApiError(413, 'Request body too large');
  }

  if (!(error instanceof ApiError)) {
    logger.error('Unhandled exception', { method: req.method, url: req.originalUrl, error: err?.message, stack: err?.stack });
    error = ApiError.internal();
  } else if (error.statusCode >= 500) {
    logger.error(`[${req.method}] ${req.originalUrl} -> ${error.statusCode} ${error.message}`);
  }

  res.status(error.statusCode).json({
    success: false,
    error: {
      message: error.message,
      ...(error.details && { details: error.details }),
      ...(env.NODE_ENV !== 'production' && error.statusCode >= 500 && { stack: err?.stack }),
    },
  });
};
