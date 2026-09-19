import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const optionalString = z.preprocess((v) => (v === '' ? undefined : v), z.string().optional());

const envSchema = z.object({
  PORT: z.coerce.number().default(8080),
  API_PREFIX: z.string().default('/api/v1'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:5173')
    .transform((val) => val.split(',').map((v) => v.trim()).filter(Boolean)),

  // Session cookie
  COOKIE_SAMESITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  COOKIE_SECURE: z.preprocess(
    (v) => (v === undefined || v === '' ? undefined : v === 'true'),
    z.boolean().optional()
  ),
  COOKIE_DOMAIN: optionalString,

  // Firebase configuration
  GOOGLE_APPLICATION_CREDENTIALS: optionalString,
  FIREBASE_PROJECT_ID: optionalString,
  FIREBASE_CLIENT_EMAIL: optionalString,
  FIREBASE_PRIVATE_KEY: optionalString,

  // Mailer configuration
  SMTP_HOST: optionalString,
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: optionalString,
  SMTP_PASS: optionalString,
  SMTP_FROM: optionalString,
  ADMIN_EMAIL: optionalString,

  // Cloudinary (product images)
  CLOUDINARY_CLOUD_NAME: optionalString,
  CLOUDINARY_API_KEY: optionalString,
  CLOUDINARY_API_SECRET: optionalString,
  CLOUDINARY_FOLDER: z.string().default('visionary-it-services'),
}).refine(
  (data) =>
    Boolean(data.GOOGLE_APPLICATION_CREDENTIALS) ||
    Boolean(data.FIREBASE_PROJECT_ID && data.FIREBASE_CLIENT_EMAIL && data.FIREBASE_PRIVATE_KEY),
  {
    message: 'Either GOOGLE_APPLICATION_CREDENTIALS or all FIREBASE_* environment variables must be set.',
    path: ['FIREBASE_PROJECT_ID'],
  }
);

const { success, data, error } = envSchema.safeParse(process.env);

if (!success) {
  console.error('❌ Invalid environment variables:');
  for (const issue of error.issues) {
    console.error(`   - ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

// Cookies must be Secure when SameSite=None, and should always be Secure in production.
data.COOKIE_SECURE = data.COOKIE_SECURE ?? (data.NODE_ENV === 'production' || data.COOKIE_SAMESITE === 'none');

export const env = data;
