import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Cannot find ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Map Zod errors
  if (err instanceof ZodError) {
    error = new ApiError(422, 'Validation failed', err.errors);
  }

  // Map Firebase Admin errors
  if (err.code && err.code.startsWith('auth/')) {
    switch (err.code) {
      case 'auth/email-already-exists':
        error = ApiError.conflict('Email already in use');
        break;
      case 'auth/user-not-found':
        error = ApiError.notFound('User not found');
        break;
      case 'auth/id-token-expired':
      case 'auth/session-cookie-expired':
        error = ApiError.unauthorized('Token expired');
        break;
      case 'auth/invalid-id-token':
      case 'auth/invalid-session-cookie':
        error = ApiError.unauthorized('Invalid token');
        break;
      default:
        error = ApiError.badRequest(err.message);
    }
  }

  // Fallback for unhandled errors
  if (!(error instanceof ApiError)) {
    logger.error('Unhandled Exception', { error: err.message, stack: err.stack });
    error = ApiError.internal('Internal Server Error');
  }

  const response = {
    success: false,
    error: {
      message: error.message,
      ...(error.details && { details: error.details }),
    },
  };

  // Include stack trace only in development
  if (env.NODE_ENV !== 'production' && error.statusCode >= 500) {
    response.error.stack = err.stack;
  }

  if (error.statusCode >= 500) {
    logger.error(`[${req.method}] ${req.originalUrl} >> StatusCode:: ${error.statusCode}, Message:: ${error.message}`);
  }

  res.status(error.statusCode).json(response);
};
