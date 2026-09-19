import { authService } from './auth.service.js';
import { response } from '../../utils/response.js';
import { sendEmail } from '../../utils/mailer.js';
import { SESSION_COOKIE_NAME, sessionCookieOptions, clearCookieOptions } from '../../config/cookies.js';
import { recordActivity } from '../activity/activity.service.js';

export const authController = {
  register: async (req, res) => {
    const data = await authService.register(req.body);
    recordActivity(req, {
      action: 'user.registered', entity: 'user', entityId: data.uid,
      summary: `${data.fullName} (${data.email}) created an account`,
      actor: { uid: data.uid, name: data.fullName, email: data.email, role: 'customer' },
    });
    return response.created(res, data);
  },

  session: async (req, res) => {
    const { sessionCookie, uid, role, email, name } = await authService.createSession(req.body.idToken);
    recordActivity(req, {
      action: 'auth.login', entity: 'user', entityId: uid,
      summary: `${name || email} signed in`,
      actor: { uid, name: name || email, email, role },
    });
    res.cookie(SESSION_COOKIE_NAME, sessionCookie, sessionCookieOptions);
    return response.ok(res, { uid, role });
  },

  logout: async (req, res) => {
    if (req.user?.uid) {
      await authService.revokeTokens(req.user.uid);
      recordActivity(req, { action: 'auth.logout', entity: 'user', entityId: req.user.uid, summary: `${req.user.name || req.user.email} signed out` });
    }
    res.clearCookie(SESSION_COOKIE_NAME, clearCookieOptions);
    return response.ok(res, { message: 'Logged out' });
  },

  getMe: async (req, res) => {
    const data = await authService.getMe(req.user);
    return response.ok(res, data);
  },

  passwordReset: async (req, res) => {
    const { email } = req.body;
    const link = await authService.generatePasswordReset(email);

    if (link) {
      recordActivity(req, {
        action: 'auth.password_reset_requested', entity: 'user', summary: `Password reset requested for ${email}`,
        actor: { uid: null, name: email, email, role: 'guest' },
      });
      await sendEmail({
        to: email,
        subject: 'Reset your Visionary IT Services password',
        html: `<p>We received a request to reset your password.</p>
               <p><a href="${link}">Click here to choose a new password</a>.</p>
               <p>If you did not request this, you can safely ignore this email.</p>`,
      });
    }

    // Always the same response to prevent email enumeration
    return response.ok(res, { message: 'If that email exists, a reset link has been sent.' });
  },

  setRole: async (req, res) => {
    const { uid, role } = req.body;
    const data = await authService.setRole(uid, role, req.user.uid);
    recordActivity(req, { action: 'user.role_changed', entity: 'user', entityId: uid, summary: `Changed role of ${data.email || uid} to ${role}` });
    return response.ok(res, data);
  },
};
