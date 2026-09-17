import { ordersService } from './orders.service.js';
import { response } from '../../utils/response.js';

export const ordersController = {
  createOrder: async (req, res) => {
    // req.user might be null if guest
    const userId = req.user ? req.user.uid : null;
    const data = await ordersService.create(userId, req.body);
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
    return response.ok(res, data);
  }
};
