import { z } from 'zod';

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1)
});

export const createOrderSchema = z.object({
  body: z.object({
    customer: z.object({
      fullName: z.string().min(2),
      email: z.string().email(),
      phone: z.string().optional(),
      company: z.string().optional(),
      notes: z.string().optional()
    }),
    items: z.array(orderItemSchema).min(1),
    paymentMethod: z.string()
  })
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    status: z.enum(['pending', 'processing', 'completed', 'cancelled']),
    paymentStatus: z.enum(['unpaid', 'paid', 'refunded']).optional()
  })
});

export const getOrderSchema = z.object({
  params: z.object({
    id: z.string()
  })
});
