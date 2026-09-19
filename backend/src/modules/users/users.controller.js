import { usersService } from './users.service.js';
import { response } from '../../utils/response.js';
import { recordActivity } from '../activity/activity.service.js';

export const usersController = {
  getMe: async (req, res) => {
    const data = await usersService.getMe(req.user.uid);
    return response.ok(res, data);
  },

  updateMe: async (req, res) => {
    const data = await usersService.updateMe(req.user.uid, req.body);
    recordActivity(req, { action: 'user.profile_updated', entity: 'user', entityId: req.user.uid, summary: `${data.fullName || data.email} updated their profile` });
    return response.ok(res, data);
  },

  getAllUsers: async (req, res) => {
    const data = await usersService.findAll();
    return response.ok(res, data);
  },

  deleteUser: async (req, res) => {
    const removed = await usersService.delete(req.params.uid, req.user.uid);
    recordActivity(req, { action: 'user.deleted', entity: 'user', entityId: req.params.uid, summary: `Deleted user ${removed.email || req.params.uid}` });
    return response.noContent(res);
  }
};
