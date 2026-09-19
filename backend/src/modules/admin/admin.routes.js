import { Router } from 'express';
import { z } from 'zod';
import { adminController } from './admin.controller.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { connectStream } from '../../realtime/hub.js';

const router = Router();

const activitySchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().min(1).max(200).default(50),
    before: z.string().optional(),
    entity: z.string().optional(),
  }),
});

const daysSchema = z.object({
  query: z.object({
    days: z.coerce.number().int().min(1).max(365).default(7),
  }),
});

router.use(requireAuth, requireAdmin);

router.get('/dashboard/stats', asyncHandler(adminController.getStats));
router.get('/dashboard/chart', validate(daysSchema), asyncHandler(adminController.getChart));

// Realtime (Server-Sent Events): stats, data changes, activity and live visitors
router.get('/stream', connectStream);

router.get('/activity', validate(activitySchema), asyncHandler(adminController.getActivity));
router.get('/visitors', asyncHandler(adminController.getVisitors));
router.get('/analytics', validate(daysSchema), asyncHandler(adminController.getAnalytics));

export default router;
