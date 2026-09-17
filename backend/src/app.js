import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import { globalLimiter } from './middleware/rateLimit.js';
import { response } from './utils/response.js';

// Route registry
import routes from './routes/index.js';

const app = express();

// Trust proxy required for secure cookies and correct IP behind Nginx
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || env.CORS_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Global rate limiter (except for health check)
app.use(env.API_PREFIX, globalLimiter);

// Health check (outside API prefix and rate limiter)
app.get('/health', (req, res) => response.ok(res, { status: 'healthy', timestamp: new Date().toISOString() }));

// API routes
app.use(env.API_PREFIX, routes);

// 404 handler
app.use(notFoundHandler);

// Central error handler
app.use(errorHandler);

export default app;
