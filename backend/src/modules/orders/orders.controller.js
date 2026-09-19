import { ordersService } from './orders.service.js';
import { response } from '../../utils/response.js';
import { recordActivity } from '../activity/activity.service.js';

export const ordersController = {
  createOrder: async (req, res) => {
    // req.user might be null if guest
    const userId = req.user ? req.user.uid : null;
    const data = await ordersService.create(userId, req.body);
    recordActivity(req, {
      action: 'order.created', entity: 'order', entityId: data.id,
      summary: `New order ${data.orderNumber} from ${data.customer.fullName} (${data.currency} ${data.total.toLocaleString()})`,
      meta: { total: data.total, items: data.items.length },
    });
    return response.created(res, data);
  },

  getMyOrders: async (req, res) => {
    const data = await ordersService.findMine(req.user.uid);
    return response.ok(res, data);
  },

  getOrder: async (req, res) => {
    // We pass userId and role to enforce access control in the service
    const userId = req.user ? req.user.uid : null;
    const role = req.user ? req.user.role : null;
    
    const data = await ordersService.findById(req.params.id, userId, role);
    return response.ok(res, data);
  },

  getAllOrders: async (req, res) => {
    const data = await ordersService.findAll();
    return response.ok(res, data);
  },

  updateOrderStatus: async (req, res) => {
    const data = await ordersService.updateStatus(req.params.id, req.body);
    recordActivity(req, {
      action: 'order.status_changed', entity: 'order', entityId: data.id,
      summary: `Order ${data.orderNumber} is now ${data.status} (payment: ${data.paymentStatus})`,
      meta: req.body,
    });
    return response.ok(res, data);
  }
};
