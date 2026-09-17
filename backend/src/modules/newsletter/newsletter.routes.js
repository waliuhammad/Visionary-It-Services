import { Router } from 'express';
import { newsletterController } from './newsletter.controller.js';
import * as schemas from './newsletter.schema.js';
import { validate } from '../../middleware/validate.js';
import { writeLimiter } from '../../middleware/rateLimit.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

// Public routes
router.post('/subscribe', writeLimiter, validate(schemas.newsletterSchema), asyncHandler(newsletterController.subscribe));
router.post('/unsubscribe', writeLimiter, validate(schemas.newsletterSchema), asyncHandler(newsletterController.unsubscribe));

export default router;
