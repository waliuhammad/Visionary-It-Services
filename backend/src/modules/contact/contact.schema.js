import { z } from 'zod';

export const createContactSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().email(),
    subject: z.string().trim().min(2).max(150),
    message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000),
    // Honeypot field
    website: z.string().optional()
  })
});

export const updateContactSchema = z.object({
  body: z.object({
    read: z.boolean()
  }),
  params: z.object({
    id: z.string()
  })
});
