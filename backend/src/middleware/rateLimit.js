import rateLimit from 'express-rate-limit';
import { ApiError } from '../utils/ApiError.js';

const handler = (req, res, next) => {
  next(ApiError.tooMany('Too many requests, please try again later.'));
};

// Global limit: 300 requests per 15 minutes
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

// Auth limit: 10 requests per 15 minutes, skipping successful requests
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => next(ApiError.tooMany('Too many failed authentication attempts.')),
});

// Write limit: 8 requests per hour for contact/newsletter
export const writeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => next(ApiError.tooMany('Too many submissions, please try again later.')),
});
