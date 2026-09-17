import { newsletterService } from './newsletter.service.js';
import { response } from '../../utils/response.js';

export const newsletterController = {
  subscribe: async (req, res) => {
    await newsletterService.subscribe(req.body.email);
    return response.ok(res, { message: 'Successfully subscribed' });
  },

  unsubscribe: async (req, res) => {
    await newsletterService.unsubscribe(req.body.email);
    return response.ok(res, { message: 'Successfully unsubscribed' });
  }
};
