import { Router } from 'express';
import { contactController } from './contact.controller.js';
import * as schemas from './contact.schema.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import { writeLimiter } from '../../middleware/rateLimit.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

// Public routes
router.post('/', writeLimiter, validate(schemas.createContactSchema), asyncHandler(contactController.createMessage));

// Admin routes
router.get('/', requireAuth, requireAdmin, asyncHandler(contactController.getMessages));
router.patch('/:id', requireAuth, requireAdmin, validate(schemas.updateContactSchema), asyncHandler(contactController.updateMessage));
router.delete('/:id', requireAuth, requireAdmin, asyncHandler(contactController.deleteMessage));

export default router;
