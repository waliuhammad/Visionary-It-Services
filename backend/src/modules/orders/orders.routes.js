import { Router } from 'express';
import { ordersController } from './orders.controller.js';
import * as schemas from './orders.schema.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth, requireAdmin, optionalAuth } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

// Guest/User routes
router.post('/', optionalAuth, validate(schemas.createOrderSchema), asyncHandler(ordersController.createOrder));
router.get('/mine', requireAuth, asyncHandler(ordersController.getMyOrders));

// Mixed access route (owner or admin)
router.get('/:id', requireAuth, validate(schemas.getOrderSchema), asyncHandler(ordersController.getOrder));

// Admin routes
router.get('/', requireAuth, requireAdmin, asyncHandler(ordersController.getAllOrders));
router.patch('/:id/status', requireAuth, requireAdmin, validate(schemas.updateOrderStatusSchema), asyncHandler(ordersController.updateOrderStatus));

export default router;
