import { authService } from './auth.service.js';
import { response } from '../../utils/response.js';
import { env } from '../../config/env.js';
import { sendEmail } from '../../utils/mailer.js';

const COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 5 * 1000, // 5 days
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'none', // Needed for cross-origin requests if API and frontend are on different origins
};

export const authController = {
  register: async (req, res) => {
    const data = await authService.register(req.body);
    return response.created(res, data);
  },

  session: async (req, res) => {
    const { idToken } = req.body;
    const { sessionCookie } = await authService.createSession(idToken);
    
    res.cookie('__session', sessionCookie, COOKIE_OPTIONS);
    return response.ok(res, { message: 'Session created' });
  },

  logout: async (req, res) => {
    // If the user was authenticated, revoke their tokens
    if (req.user?.uid) {
      await authService.revokeTokens(req.user.uid);
    }
    
    // Clear the cookie
    res.clearCookie('__session', COOKIE_OPTIONS);
    return response.ok(res, { message: 'Logged out' });
  },

  getMe: async (req, res) => {
    const data = await authService.getMe(req.user.uid);
    return response.ok(res, data);
  },

  passwordReset: async (req, res) => {
    const { email } = req.body;
    const link = await authService.generatePasswordReset(email);
    
    if (link) {
      // In a real app, send the email here
      await sendEmail({
        to: email,
        subject: 'Password Reset',
        html: `<p>Click <a href="${link}">here</a> to reset your password.</p>`
      });
    }
    
    // Always return success to prevent email enumeration
    return response.ok(res, { message: 'If that email exists, a reset link has been sent.' });
  },

  setRole: async (req, res) => {
    const { uid, role } = req.body;
    const data = await authService.setRole(uid, role);
    return response.ok(res, data);
  }
};
