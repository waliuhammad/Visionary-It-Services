import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Validates request body, query, and params using a Zod schema shaped like
 * `z.object({ body, query, params })`. Only the keys present in the schema are replaced.
 * @param {import('zod').ZodObject} schema
 */
export const validate = (schema) => asyncHandler(async (req, res, next) => {
  const validated = await schema.parseAsync({
    body: req.body ?? {},
    query: req.query,
    params: req.params,
  });

  if ('body' in schema.shape) req.body = validated.body;
  if ('params' in schema.shape) req.params = validated.params;
  if ('query' in schema.shape) {
    // Express 5 exposes req.query as a getter, so it must be redefined rather than assigned.
    Object.defineProperty(req, 'query', { value: validated.query, writable: true, configurable: true, enumerable: true });
  }

  next();
});
