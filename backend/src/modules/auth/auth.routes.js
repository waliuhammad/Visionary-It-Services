import { Router } from 'express';
import { authController } from './auth.controller.js';
import * as schemas from './auth.schema.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth, requireAdmin, optionalAuth } from '../../middleware/auth.js';
import { authLimiter } from '../../middleware/rateLimit.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

router.post('/register', authLimiter, validate(schemas.registerSchema), asyncHandler(authController.register));
router.post('/session', authLimiter, validate(schemas.sessionSchema), asyncHandler(authController.session));
router.post('/logout', optionalAuth, asyncHandler(authController.logout));
router.post('/password-reset', authLimiter, validate(schemas.passwordResetSchema), asyncHandler(authController.passwordReset));

// Protected routes
router.get('/me', requireAuth, asyncHandler(authController.getMe));

// Admin routes
router.post('/role', requireAuth, requireAdmin, validate(schemas.roleSchema), asyncHandler(authController.setRole));

export default router;
