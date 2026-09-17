import { adminService } from './admin.service.js';
import { response } from '../../utils/response.js';

export const adminController = {
  getStats: async (req, res) => {
    const data = await adminService.getStats();
    return response.ok(res, data);
  },

  getChart: async (req, res) => {
    const days = parseInt(req.query.days) || 7;
    const data = await adminService.getChart(days);
    return response.ok(res, data);
  }
};
