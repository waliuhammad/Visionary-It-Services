import { adminService } from './admin.service.js';
import { activityService } from '../activity/activity.service.js';
import { getVisitors } from '../../realtime/hub.js';
import { response } from '../../utils/response.js';

export const adminController = {
  getStats: async (req, res) => {
    const data = await adminService.getStats();
    return response.ok(res, data);
  },

  getChart: async (req, res) => {
    const data = await adminService.getChart(req.query.days);
    return response.ok(res, data);
  },

  getActivity: async (req, res) => {
    const data = await activityService.list(req.query);
    return response.ok(res, data);
  },

  getVisitors: async (req, res) => {
    return response.ok(res, getVisitors());
  },

  getAnalytics: async (req, res) => {
    const data = await adminService.getAnalytics(req.query.days);
    return response.ok(res, data);
  },
};
