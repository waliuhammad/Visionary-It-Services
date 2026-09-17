import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(8080),
  API_PREFIX: z.string().default('/api/v1'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGINS: z.string().transform((val) => val.split(',').map((v) => v.trim())),
  
  // Firebase configuration
  GOOGLE_APPLICATION_CREDENTIALS: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  
  // Mailer configuration
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
}).refine(
  (data) => {
    if (!data.GOOGLE_APPLICATION_CREDENTIALS) {
      return data.FIREBASE_PROJECT_ID && data.FIREBASE_CLIENT_EMAIL && data.FIREBASE_PRIVATE_KEY;
    }
    return true;
  },
  {
    message: "Either GOOGLE_APPLICATION_CREDENTIALS or all FIREBASE_* environment variables must be set.",
    path: ["FIREBASE_PROJECT_ID"]
  }
);

const { success, data, error } = envSchema.safeParse(process.env);

if (!success) {
  console.error("❌ Invalid environment variables:", error.format());
  process.exit(1);
}

export const env = data;
