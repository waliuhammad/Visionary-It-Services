import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    country: z.string().optional(),
  })
});

export const getUserSchema = z.object({
  params: z.object({
    uid: z.string()
  })
});
