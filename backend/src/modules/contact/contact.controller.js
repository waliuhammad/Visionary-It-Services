import { contactService } from './contact.service.js';
import { response } from '../../utils/response.js';
import { recordActivity } from '../activity/activity.service.js';

export const contactController = {
  createMessage: async (req, res) => {
    // Service handles honeypot check silently
    const saved = await contactService.create(req.body);
    if (saved.id) {
      recordActivity(req, {
        action: 'contact.received', entity: 'message', entityId: saved.id,
        summary: `New message from ${saved.name}: "${saved.subject}"`,
        actor: { uid: null, name: saved.name, email: saved.email, role: 'guest' },
      });
    }
    return response.created(res, { message: 'Message received' });
  },

  getMessages: async (req, res) => {
    const data = await contactService.findAll();
    return response.ok(res, data);
  },

  updateMessage: async (req, res) => {
    const { id } = req.params;
    const { read } = req.body;
    const data = await contactService.update(id, { read });
    recordActivity(req, { action: 'contact.updated', entity: 'message', entityId: id, summary: `Marked message from ${data.name} as ${read ? 'read' : 'unread'}` });
    return response.ok(res, data);
  },

  deleteMessage: async (req, res) => {
    const { id } = req.params;
    await contactService.delete(id);
    recordActivity(req, { action: 'contact.deleted', entity: 'message', entityId: id, summary: 'Deleted a contact message' });
    return response.noContent(res);
  }
};
