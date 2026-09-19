import { z } from 'zod';

export const ORDER_STATUSES = ['pending', 'processing', 'paid', 'shipped', 'delivered', 'completed', 'cancelled'];
export const PAYMENT_METHODS = ['bank_transfer', 'jazzcash_easypaisa', 'pay_on_delivery', 'card'];
export const PAYMENT_STATUSES = ['unpaid', 'paid', 'refunded'];

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1)
});

export const createOrderSchema = z.object({
  body: z.object({
    customer: z.object({
      fullName: z.string().trim().min(2).max(100),
      email: z.email().trim().toLowerCase(),
      phone: z.string().trim().max(30).optional(),
      company: z.string().trim().max(100).optional(),
      notes: z.string().trim().max(2000).optional()
    }),
    items: z.array(orderItemSchema).min(1).max(50),
    paymentMethod: z.enum(PAYMENT_METHODS)
  })
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    status: z.enum(ORDER_STATUSES).optional(),
    paymentStatus: z.enum(PAYMENT_STATUSES).optional()
  }).refine(b => b.status || b.paymentStatus, 'status or paymentStatus is required')
});

export const getOrderSchema = z.object({
  params: z.object({
    id: z.string()
  })
});
