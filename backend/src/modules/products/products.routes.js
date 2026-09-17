import { Router } from 'express';
import { productsController } from './products.controller.js';
import * as schemas from './products.schema.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

// Public routes
router.get('/', validate(schemas.getProductsSchema), asyncHandler(productsController.getProducts));
router.get('/featured', asyncHandler(productsController.getFeatured));
router.get('/slug/:slug', validate(schemas.getProductBySlugSchema), asyncHandler(productsController.getProductBySlug));
router.get('/:id', validate(schemas.getProductSchema), asyncHandler(productsController.getProduct));
router.get('/:id/related', validate(schemas.getProductSchema), asyncHandler(productsController.getRelated));

// Admin routes
router.post('/', requireAuth, requireAdmin, validate(schemas.createProductSchema), asyncHandler(productsController.createProduct));
router.patch('/:id', requireAuth, requireAdmin, validate(schemas.updateProductSchema), asyncHandler(productsController.updateProduct));
router.delete('/:id', requireAuth, requireAdmin, validate(schemas.getProductSchema), asyncHandler(productsController.deleteProduct));

export default router;
