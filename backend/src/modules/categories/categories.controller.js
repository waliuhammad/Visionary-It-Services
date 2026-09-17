import { categoriesService } from './categories.service.js';
import { response } from '../../utils/response.js';

export const categoriesController = {
  getCategories: async (req, res) => {
    const data = await categoriesService.findAll();
    return response.ok(res, data);
  },

  createCategory: async (req, res) => {
    const data = await categoriesService.create(req.body);
    return response.created(res, data);
  },

  deleteCategory: async (req, res) => {
    await categoriesService.delete(req.params.id);
    return response.noContent(res);
  }
};
