import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from './logger.js';

let transporter;

if (env.SMTP_HOST && env.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
} else {
  logger.warn('SMTP configuration missing, emails will not be sent.');
}

/**
 * Send an email
 * @param {Object} options Email options
 * @param {string} options.to Recipient email address
 * @param {string} options.subject Email subject
 * @param {string} options.html HTML content
 */
export const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) {
    logger.info(`Would send email to ${to}: ${subject}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: env.SMTP_FROM,
      to,
      subject,
      html,
    });
    logger.info(`Email sent to ${to}`, { subject });
  } catch (error) {
    logger.error('Failed to send email', { to, error: error.message });
    // We don't throw here to avoid breaking the main request flow for non-critical emails
  }
};
