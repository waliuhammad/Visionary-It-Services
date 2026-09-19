import { response } from '../../utils/response.js';
import { ApiError } from '../../utils/ApiError.js';
import { cloudinaryFolder, uploadBuffer, destroyByPublicId, publicIdFromUrl } from '../../utils/cloudinary.js';
import { recordActivity } from '../activity/activity.service.js';

export const uploadsController = {
  upload: async (req, res) => {
    if (!req.files?.length) throw ApiError.badRequest('No files received. Send images in the "files" field.');

    const folder = cloudinaryFolder(req.query.folder);
    const data = await Promise.all(req.files.map((file) => uploadBuffer(file.buffer, { folder })));

    recordActivity(req, {
      action: 'upload.created',
      entity: 'upload',
      summary: `Uploaded ${data.length} image${data.length > 1 ? 's' : ''} to ${req.query.folder}`,
      meta: { publicIds: data.map((d) => d.publicId) },
    });
    return response.created(res, data);
  },

  remove: async (req, res) => {
    const publicId = req.body.publicId || publicIdFromUrl(req.body.url);
    if (!publicId) throw ApiError.badRequest('That URL is not an image in this Cloudinary account');

    const deleted = await destroyByPublicId(publicId);
    recordActivity(req, { action: 'upload.deleted', entity: 'upload', entityId: publicId, summary: `Deleted image ${publicId}` });
    return response.ok(res, { publicId, deleted });
  },
};
