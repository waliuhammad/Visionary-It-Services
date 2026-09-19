import { env } from './env.js';

export const SESSION_COOKIE_NAME = '__session';
export const SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000; // 5 days (Firebase allows up to 14)

const baseOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: env.COOKIE_SAMESITE,
  path: '/',
  ...(env.COOKIE_DOMAIN && { domain: env.COOKIE_DOMAIN }),
};

export const sessionCookieOptions = { ...baseOptions, maxAge: SESSION_DURATION_MS };
export const clearCookieOptions = baseOptions;
