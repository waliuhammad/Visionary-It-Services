import { z } from 'zod';

export const ROLES = ['customer', 'editor', 'admin'];

export const registerSchema = z.object({
  body: z.object({
    email: z.email('Invalid email address').trim().toLowerCase(),
    password: z.string().min(6, 'Password must be at least 6 characters').max(128),
    fullName: z.string().trim().min(2, 'Full name is required').max(100),
  }),
});

export const sessionSchema = z.object({
  body: z.object({
    idToken: z.string({ error: 'idToken is required' }).min(1, 'idToken is required'),
  }),
});

export const passwordResetSchema = z.object({
  body: z.object({
    email: z.email('Invalid email address').trim().toLowerCase(),
  }),
});

export const roleSchema = z.object({
  body: z.object({
    uid: z.string({ error: 'uid is required' }).min(1, 'uid is required'),
    role: z.enum(ROLES, { error: `role must be one of: ${ROLES.join(', ')}` }),
  }),
});
