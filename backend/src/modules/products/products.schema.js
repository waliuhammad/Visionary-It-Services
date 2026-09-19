import { z } from 'zod';

export const getProductsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    // The admin panel loads the whole catalogue in one request
    limit: z.coerce.number().int().min(1).max(1000).default(12),
    category: z.string().trim().optional(),
    search: z.string().trim().optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    bestSeller: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
    sort: z.enum(['featured', 'price_asc', 'price_desc', 'newest', 'name_asc']).default('newest'),
    cursor: z.string().optional(),
  })
});

const productBodySchema = z.object({
  name: z.string().trim().min(2),
  slug: z.string().trim().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers and hyphens'),
  // Categories are managed from the admin panel (/categories), so any name is accepted
  category: z.string().trim().min(2),
  shortDescription: z.string().trim().optional(),
  description: z.string().trim().min(10),
  price: z.number().min(0),
  currency: z.string().default('PKR'),
  priceLabel: z.string().optional(),
  // Absolute URL or a site-relative path such as /images/products/x.webp
  image: z.string().trim().min(1),
  images: z.array(z.string().trim().min(1)).default([]),
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
  // .partial() alone would still apply the defaults above and overwrite stored values
  body: z.object(
    Object.fromEntries(
      Object.entries(productBodySchema.shape).map(([key, schema]) => [
        key,
        (schema instanceof z.ZodDefault ? schema.removeDefault() : schema).optional(),
      ])
    )
  )
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
