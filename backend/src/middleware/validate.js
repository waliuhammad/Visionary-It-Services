import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Validates request body, query, and params using a Zod schema.
 * @param {import('zod').AnyZodObject} schema 
 */
export const validate = (schema) => asyncHandler(async (req, res, next) => {
  const validated = await schema.parseAsync({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  // Attach validated data back to the request object
  // This strips out any unknown fields if the schema drops them
  req.body = validated.body;
  req.query = validated.query;
  req.params = validated.params;

  next();
});
