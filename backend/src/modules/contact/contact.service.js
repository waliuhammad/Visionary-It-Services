import { contactMessagesRef } from '../../config/firebase.js';
import { logger } from '../../utils/logger.js';
import { sendEmail } from '../../utils/mailer.js';
import { env } from '../../config/env.js';
import { HttpError } from '../../utils/response.js';

export const contactService = {
  create: async (data) => {
    // Honeypot check
    if (data.website) {
      logger.info('Honeypot triggered, discarding message silently');
      return { success: true };
    }

    const messageData = {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      read: false,
      createdAt: new Date().toISOString()
    };

    const docRef = await contactMessagesRef.add(messageData);
    logger.info('Contact message saved', { id: docRef.id });

    // Optionally notify admin
    if (env.SMTP_USER) {
      await sendEmail({
        to: env.SMTP_USER, // Send to the configured system user
        subject: `New Contact Request: ${data.subject}`,
        html: `
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</p>
        `
      });
    }

    return { id: docRef.id, ...messageData };
  },

  findAll: async () => {
    const snapshot = await contactMessagesRef.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  update: async (id, data) => {
    const docRef = contactMessagesRef.doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      throw new HttpError(404, 'Message not found');
    }

    await docRef.update(data);
    logger.info('Contact message updated', { id });
    
    return { id, ...doc.data(), ...data };
  },

  delete: async (id) => {
    const docRef = contactMessagesRef.doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      throw new HttpError(404, 'Message not found');
    }

    await docRef.delete();
    logger.info('Contact message deleted', { id });
    return true;
  }
};
