import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import productsRoutes from '../modules/products/products.routes.js';
import categoriesRoutes from '../modules/categories/categories.routes.js';
import ordersRoutes from '../modules/orders/orders.routes.js';
import usersRoutes from '../modules/users/users.routes.js';
import contactRoutes from '../modules/contact/contact.routes.js';
import newsletterRoutes from '../modules/newsletter/newsletter.routes.js';
import settingsRoutes from '../modules/settings/settings.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';
import uploadsRoutes from '../modules/uploads/uploads.routes.js';
import trackingRoutes from '../modules/tracking/tracking.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/orders', ordersRoutes);
router.use('/users', usersRoutes);
router.use('/contact', contactRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/settings', settingsRoutes);
router.use('/admin', adminRoutes);
router.use('/uploads', uploadsRoutes);
router.use('/track', trackingRoutes);

export default router;
