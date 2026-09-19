import { productsService } from './products.service.js';
import { response } from '../../utils/response.js';
import { recordActivity } from '../activity/activity.service.js';

export const productsController = {
  getProducts: async (req, res) => {
    const { data, meta } = await productsService.find(req.query);
    return response.paginated(res, data, meta);
  },

  getFeatured: async (req, res) => {
    const data = await productsService.findFeatured();
    return response.ok(res, data);
  },

  getProduct: async (req, res) => {
    const data = await productsService.findById(req.params.id);
    return response.ok(res, data);
  },

  getProductBySlug: async (req, res) => {
    const data = await productsService.findBySlug(req.params.slug);
    return response.ok(res, data);
  },

  getRelated: async (req, res) => {
    const data = await productsService.findRelated(req.params.id);
    return response.ok(res, data);
  },

  createProduct: async (req, res) => {
    const data = await productsService.create(req.body);
    recordActivity(req, { action: 'product.created', entity: 'product', entityId: data.id, summary: `Created product "${data.name}"` });
    return response.created(res, data);
  },

  updateProduct: async (req, res) => {
    const data = await productsService.update(req.params.id, req.body);
    recordActivity(req, { action: 'product.updated', entity: 'product', entityId: data.id, summary: `Updated product "${data.name}"`, meta: { fields: Object.keys(req.body) } });
    return response.ok(res, data);
  },

  deleteProduct: async (req, res) => {
    const removed = await productsService.delete(req.params.id);
    recordActivity(req, { action: 'product.deleted', entity: 'product', entityId: req.params.id, summary: `Deleted product "${removed.name}"` });
    return response.noContent(res);
  }
};
