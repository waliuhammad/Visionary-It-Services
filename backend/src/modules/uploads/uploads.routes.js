import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { uploadsController } from './uploads.controller.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { ApiError } from '../../utils/ApiError.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024, files: 10 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(ApiError.badRequest(`Unsupported file type ${file.mimetype}. Use JPG, PNG, WebP, GIF or AVIF.`));
  },
});

const uploadQuerySchema = z.object({
  query: z.object({
    folder: z.enum(['products', 'categories', 'banners', 'misc']).default('products'),
  }),
});

const deleteSchema = z.object({
  body: z.object({
    publicId: z.string().min(1).optional(),
    url: z.string().url().optional(),
  }).refine((b) => b.publicId || b.url, 'publicId or url is required'),
});

const router = Router();
const staff = [requireAuth, requireRole('admin', 'editor')];

// multipart/form-data with one or more files in the "files" field
router.post('/', ...staff, upload.array('files', 10), validate(uploadQuerySchema), asyncHandler(uploadsController.upload));
router.delete('/', ...staff, validate(deleteSchema), asyncHandler(uploadsController.remove));

export default router;
