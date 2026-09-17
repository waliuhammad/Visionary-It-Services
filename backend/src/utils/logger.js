import { env } from '../config/env.js';

export const logger = {
  info: (message, meta = {}) => {
    if (env.NODE_ENV !== 'test') {
      console.log(JSON.stringify({ level: 'info', message, ...meta, timestamp: new Date().toISOString() }));
    }
  },
  warn: (message, meta = {}) => {
    if (env.NODE_ENV !== 'test') {
      console.warn(JSON.stringify({ level: 'warn', message, ...meta, timestamp: new Date().toISOString() }));
    }
  },
  error: (message, meta = {}) => {
    if (env.NODE_ENV !== 'test') {
      console.error(JSON.stringify({ level: 'error', message, ...meta, timestamp: new Date().toISOString() }));
    }
  }
};
