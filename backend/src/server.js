import app from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const server = app.listen(env.PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

// Graceful shutdown
const shutdown = () => {
  logger.info('SIGTERM/SIGINT received, shutting down gracefully...');
  
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });

  // Force exit if connections don't close after 10s
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default server;
