import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export const isCloudinaryConfigured = Boolean(
  env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
} else {
  logger.warn('Cloudinary is not configured; image uploads are disabled. Set CLOUDINARY_* in .env.');
}

export { cloudinary };
