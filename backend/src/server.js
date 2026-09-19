import app from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { startRealtime, stopRealtime } from './realtime/hub.js';

const server = app.listen(env.PORT, () => {
  logger.info(`API running in ${env.NODE_ENV} mode on http://localhost:${env.PORT}${env.API_PREFIX}`);
  startRealtime();
});

const shutdown = (signal) => {
  logger.info(`${signal} received, shutting down gracefully...`);
  stopRealtime();

  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });

  // Force exit if connections don't close within 10s
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', { error: reason?.message ?? String(reason) });
});

export default server;
