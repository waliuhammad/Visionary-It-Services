import { z } from 'zod';

export const updateSettingsSchema = z.object({
  body: z.object({
    freeShippingThreshold: z.number().optional(),
    shippingFee: z.number().optional(),
    heroBanners: z.array(z.object({
      id: z.string(),
      title: z.string(),
      caption: z.string(),
      image: z.string().optional()
    })).optional()
  })
});
