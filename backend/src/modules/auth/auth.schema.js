import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    fullName: z.string().min(2, 'Full name is required'),
  })
});

export const sessionSchema = z.object({
  body: z.object({
    idToken: z.string({ required_error: 'idToken is required' })
  })
});

export const passwordResetSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address')
  })
});

export const roleSchema = z.object({
  body: z.object({
    uid: z.string({ required_error: 'uid is required' }),
    role: z.enum(['customer', 'admin', 'editor'], {
      required_error: 'role is required',
      invalid_type_error: 'Invalid role'
    })
  })
});
