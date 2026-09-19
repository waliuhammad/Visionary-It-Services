import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import { env } from '../config/env.js';
import { ApiError } from './ApiError.js';
import { logger } from './logger.js';

const UPLOAD_MARKER = '/image/upload/';

const assertConfigured = () => {
  if (!isCloudinaryConfigured) {
    throw new ApiError(503, 'Image storage is not configured. Add the CLOUDINARY_* settings to the API .env file.');
  }
};

/** Cloudinary folder for a kind of asset, e.g. "visionary-it-services/products". */
export const cloudinaryFolder = (sub) => `${env.CLOUDINARY_FOLDER}/${sub}`;

/**
 * Delivery URL with automatic format (WebP/AVIF) and quality — what the site should display.
 */
const optimizedUrl = (secureUrl) => secureUrl.replace(UPLOAD_MARKER, `${UPLOAD_MARKER}f_auto,q_auto/`);

const toResult = (res) => ({
  url: optimizedUrl(res.secure_url),
  originalUrl: res.secure_url,
  publicId: res.public_id,
  width: res.width,
  height: res.height,
  bytes: res.bytes,
  format: res.format,
});

/** True when the URL points at an image in this project's Cloudinary account. */
export const isOwnCloudinaryUrl = (url = '') =>
  isCloudinaryConfigured &&
  typeof url === 'string' &&
  url.includes(`res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}${UPLOAD_MARKER}`);

/**
 * Extract the public id from a Cloudinary delivery URL
 * (…/image/upload/f_auto,q_auto/v1712345/folder/name.webp -> folder/name).
 */
export const publicIdFromUrl = (url) => {
  if (!isOwnCloudinaryUrl(url)) return null;
  const segments = url.split(UPLOAD_MARKER)[1].split('?')[0].split('/');
  // Drop transformation segments ("f_auto,q_auto", "w_300") and the version ("v1712345")
  while (segments.length > 1 && (/^[a-z]{1,3}_[^/]*$/.test(segments[0]) || /^v\d+$/.test(segments[0]))) {
    segments.shift();
  }
  return decodeURIComponent(segments.join('/')).replace(/\.[a-z0-9]+$/i, '');
};

/** Upload an in-memory file (from multer). */
export const uploadBuffer = (buffer, { folder, publicId } = {}) => {
  assertConfigured();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: 'image',
        overwrite: Boolean(publicId),
        unique_filename: !publicId,
      },
      (error, result) => (error ? reject(new ApiError(502, `Image upload failed: ${error.message}`)) : resolve(toResult(result)))
    );
    stream.end(buffer);
  });
};

/** Upload from a remote URL or a local file path. */
export const uploadFromSource = async (source, { folder, publicId } = {}) => {
  assertConfigured();
  const result = await cloudinary.uploader.upload(source, {
    folder,
    public_id: publicId,
    resource_type: 'image',
    overwrite: true,
  });
  return toResult(result);
};

/** Delete images by URL, ignoring URLs that are not ours. Never throws. */
export const destroyByUrls = async (urls = []) => {
  const ids = [...new Set(urls.map(publicIdFromUrl).filter(Boolean))];
  await Promise.all(ids.map(async (id) => {
    try {
      await cloudinary.uploader.destroy(id, { invalidate: true });
      logger.info('Cloudinary image deleted', { publicId: id });
    } catch (error) {
      logger.warn('Cloudinary delete failed', { publicId: id, error: error.message });
    }
  }));
};

export const destroyByPublicId = async (publicId) => {
  assertConfigured();
  const res = await cloudinary.uploader.destroy(publicId, { invalidate: true });
  return res.result === 'ok';
};
