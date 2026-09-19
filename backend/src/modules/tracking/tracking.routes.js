import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';
import { ApiError } from '../../utils/ApiError.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { response } from '../../utils/response.js';
import { trackingService } from './tracking.service.js';

// Heartbeats arrive every ~30s per open tab; allow a generous amount per IP
const trackingLimiter = rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => next(ApiError.tooMany()),
});

const trackSchema = z.object({
  body: z.object({
    sid: z.string().regex(/^[A-Za-z0-9-]{8,64}$/, 'Invalid session id'),
    path: z.string().max(300).startsWith('/'),
    title: z.string().max(200).optional(),
    referrer: z.string().max(500).optional(),
  }),
});

const router = Router();

router.post('/pageview', trackingLimiter, validate(trackSchema), asyncHandler(async (req, res) => {
  trackingService.pageView(req.body, req.headers['user-agent']);
  return response.noContent(res);
}));

router.post('/heartbeat', trackingLimiter, validate(trackSchema), asyncHandler(async (req, res) => {
  trackingService.heartbeat(req.body, req.headers['user-agent']);
  return response.noContent(res);
}));

export default router;
