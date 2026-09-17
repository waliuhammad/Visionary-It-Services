import { Router } from 'express';
import { adminController } from './admin.controller.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

// Admin routes
router.get('/dashboard/stats', requireAuth, requireAdmin, asyncHandler(adminController.getStats));
router.get('/dashboard/chart', requireAuth, requireAdmin, asyncHandler(adminController.getChart));

export default router;
