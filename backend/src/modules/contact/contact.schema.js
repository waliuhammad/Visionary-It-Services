import { z } from 'zod';

export const createContactSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    subject: z.string().min(2),
    message: z.string().min(10),
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
