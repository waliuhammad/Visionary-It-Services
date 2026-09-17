import { contactService } from './contact.service.js';
import { response } from '../../utils/response.js';

export const contactController = {
  createMessage: async (req, res) => {
    // Service handles honeypot check silently
    await contactService.create(req.body);
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
    return response.ok(res, data);
  },

  deleteMessage: async (req, res) => {
    const { id } = req.params;
    await contactService.delete(id);
    return response.noContent(res);
  }
};
