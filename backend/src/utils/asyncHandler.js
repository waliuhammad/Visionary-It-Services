/**
 * Wrapper for async route handlers to pass errors to Express error middleware
 * so we don't need try/catch blocks in every controller.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
