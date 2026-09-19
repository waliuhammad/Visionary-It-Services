import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import { globalLimiter } from './middleware/rateLimit.js';
import { ApiError } from './utils/ApiError.js';
import { response } from './utils/response.js';
import routes from './routes/index.js';

const app = express();

// Required for secure cookies and correct client IPs behind Nginx / a load balancer
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Requests without an Origin header (curl, server-to-server, same-origin) are allowed
    if (!origin || env.CORS_ORIGINS.includes(origin)) return callback(null, true);
    callback(ApiError.forbidden(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
}));
app.use(compression({
  // Server-Sent Events must be streamed unbuffered
  filter: (req, res) => !String(res.getHeader('Content-Type') || '').includes('text/event-stream') && compression.filter(req, res),
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

// Health checks (not rate limited)
const health = (req, res) => response.ok(res, { status: 'healthy', timestamp: new Date().toISOString() });
app.get('/health', health);
app.get(`${env.API_PREFIX}/health`, health);

app.use(env.API_PREFIX, globalLimiter, routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
