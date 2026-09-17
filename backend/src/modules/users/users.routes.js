import { Router } from 'express';
import { usersController } from './users.controller.js';
import * as schemas from './users.schema.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

// User routes
router.get('/me', requireAuth, asyncHandler(usersController.getMe));
router.patch('/me', requireAuth, validate(schemas.updateUserSchema), asyncHandler(usersController.updateMe));

// Admin routes
router.get('/', requireAuth, requireAdmin, asyncHandler(usersController.getAllUsers));
router.delete('/:uid', requireAuth, requireAdmin, validate(schemas.getUserSchema), asyncHandler(usersController.deleteUser));

export default router;
