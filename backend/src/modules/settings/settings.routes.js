import { Router } from 'express';
import { settingsController } from './settings.controller.js';
import * as schemas from './settings.schema.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

// Public route to get settings
router.get('/', asyncHandler(settingsController.getSettings));

// Admin route to update settings
router.patch('/', requireAuth, requireAdmin, validate(schemas.updateSettingsSchema), asyncHandler(settingsController.updateSettings));

export default router;
