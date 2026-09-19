import { categoriesService } from './categories.service.js';
import { response } from '../../utils/response.js';
import { recordActivity } from '../activity/activity.service.js';

export const categoriesController = {
  getCategories: async (req, res) => {
    const data = await categoriesService.findAll();
    return response.ok(res, data);
  },

  createCategory: async (req, res) => {
    const data = await categoriesService.create(req.body);
    recordActivity(req, { action: 'category.created', entity: 'category', entityId: data.id, summary: `Created category "${data.name}"` });
    return response.created(res, data);
  },

  deleteCategory: async (req, res) => {
    const removed = await categoriesService.delete(req.params.id);
    recordActivity(req, { action: 'category.deleted', entity: 'category', entityId: req.params.id, summary: `Deleted category "${removed.name}"` });
    return response.noContent(res);
  }
};
