export const response = {
  ok: (res, data = {}, meta = undefined) => {
    return res.status(200).json({
      success: true,
      data,
      ...(meta && { meta })
    });
  },

  created: (res, data = {}) => {
    return res.status(201).json({
      success: true,
      data
    });
  },

  noContent: (res) => {
    return res.status(204).end();
  },

  paginated: (res, data = [], meta = {}) => {
    return res.status(200).json({
      success: true,
      data,
      meta: {
        page: meta.page || 1,
        limit: meta.limit || data.length,
        total: meta.total || 0,
        nextCursor: meta.nextCursor || null,
        hasMore: meta.hasMore || false,
      }
    });
  }
};
