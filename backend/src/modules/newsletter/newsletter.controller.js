import { newsletterService } from './newsletter.service.js';
import { response } from '../../utils/response.js';
import { recordActivity } from '../activity/activity.service.js';

export const newsletterController = {
  subscribe: async (req, res) => {
    await newsletterService.subscribe(req.body.email);
    recordActivity(req, { action: 'newsletter.subscribed', entity: 'subscriber', entityId: req.body.email, summary: `${req.body.email} subscribed to the newsletter`, actor: { uid: null, name: req.body.email, email: req.body.email, role: 'guest' } });
    return response.ok(res, { message: 'Successfully subscribed' });
  },

  unsubscribe: async (req, res) => {
    await newsletterService.unsubscribe(req.body.email);
    recordActivity(req, { action: 'newsletter.unsubscribed', entity: 'subscriber', entityId: req.body.email, summary: `${req.body.email} unsubscribed`, actor: { uid: null, name: req.body.email, email: req.body.email, role: 'guest' } });
    return response.ok(res, { message: 'Successfully unsubscribed' });
  }
};
