import { Router } from 'express';
import { categoriesController } from './categories.controller.js';
import * as schemas from './categories.schema.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

// Public routes
router.get('/', asyncHandler(categoriesController.getCategories));

// Admin routes
router.post('/', requireAuth, requireAdmin, validate(schemas.createCategorySchema), asyncHandler(categoriesController.createCategory));
router.delete('/:id', requireAuth, requireAdmin, asyncHandler(categoriesController.deleteCategory));

export default router;
