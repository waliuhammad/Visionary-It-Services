import { z } from 'zod';

export const getProductsSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(60).default(12),
    category: z.string().optional(),
    search: z.string().optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    bestSeller: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
    sort: z.enum(['featured', 'price_asc', 'price_desc', 'newest', 'name_asc']).default('newest'),
    cursor: z.string().optional(),
  })
});

const productBodySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  category: z.enum(['Digital Service', 'Mobile App', 'Productivity', 'SaaS', 'Software', 'Template']),
  shortDescription: z.string().min(10),
  description: z.string().min(20),
  price: z.number().min(0),
  currency: z.string().default('PKR'),
  priceLabel: z.string().optional(),
  image: z.string().url(),
  images: z.array(z.string().url()).default([]),
  bestSeller: z.boolean().default(false),
  badge: z.string().optional(),
  inStock: z.boolean().default(true),
  deliveryType: z.string().default('digital'),
  tags: z.array(z.string()).default([]),
});

export const createProductSchema = z.object({
  body: productBodySchema
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: productBodySchema.partial()
});

export const getProductSchema = z.object({
  params: z.object({
    id: z.string()
  })
});

export const getProductBySlugSchema = z.object({
  params: z.object({
    slug: z.string()
  })
});
