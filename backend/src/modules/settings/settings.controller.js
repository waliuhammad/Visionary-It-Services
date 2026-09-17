import { settingsService } from './settings.service.js';
import { response } from '../../utils/response.js';

export const settingsController = {
  getSettings: async (req, res) => {
    const data = await settingsService.get();
    return response.ok(res, data);
  },

  updateSettings: async (req, res) => {
    const data = await settingsService.update(req.body);
    return response.ok(res, data);
  }
};
