import { usersService } from './users.service.js';
import { response } from '../../utils/response.js';

export const usersController = {
  getMe: async (req, res) => {
    const data = await usersService.getMe(req.user.uid);
    return response.ok(res, data);
  },

  updateMe: async (req, res) => {
    const data = await usersService.updateMe(req.user.uid, req.body);
    return response.ok(res, data);
  },

  getAllUsers: async (req, res) => {
    const data = await usersService.findAll();
    return response.ok(res, data);
  },

  deleteUser: async (req, res) => {
    await usersService.delete(req.params.uid);
    return response.noContent(res);
  }
};
