import { settingsService } from './settings.service.js';
import { response } from '../../utils/response.js';
import { recordActivity } from '../activity/activity.service.js';

export const settingsController = {
  getSettings: async (req, res) => {
    const data = await settingsService.get();
    return response.ok(res, data);
  },

  updateSettings: async (req, res) => {
    const data = await settingsService.update(req.body);
    recordActivity(req, { action: 'settings.updated', entity: 'settings', entityId: 'site', summary: `Updated site settings (${Object.keys(req.body).join(', ')})` });
    return response.ok(res, data);
  }
};
