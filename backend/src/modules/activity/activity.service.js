import { activityRef } from '../../config/firebase.js';
import { logger } from '../../utils/logger.js';

/**
 * Who performed a request, taken from the verified token (or "guest").
 */
export const actorFromRequest = (req) => {
  const u = req?.user;
  if (!u) return { uid: null, name: 'Guest', email: null, role: 'guest' };
  return {
    uid: u.uid,
    name: u.name || u.email?.split('@')[0] || 'User',
    email: u.email || null,
    role: u.role || 'customer',
  };
};

/** Firestore rejects undefined values, so drop them (and keep nesting intact). */
const clean = (value) => {
  if (Array.isArray(value)) return value.filter((v) => v !== undefined).map(clean);
  if (value && typeof value === 'object' && value.constructor === Object) {
    return Object.fromEntries(
      Object.entries(value).filter(([, v]) => v !== undefined).map(([k, v]) => [k, clean(v)])
    );
  }
  return value;
};

/**
 * Append an entry to the audit/activity log. The admin panel receives it instantly
 * through the realtime stream. Fire-and-forget: a logging failure never fails the request.
 *
 * @param {import('express').Request | null} req
 * @param {{ action: string, entity: string, entityId?: string, summary: string, meta?: object, actor?: object }} entry
 */
export const recordActivity = (req, { action, entity, entityId = null, summary, meta = {}, actor }) => {
  const from = actor || actorFromRequest(req);
  const doc = clean({
    action,
    entity,
    entityId: entityId ?? null,
    summary,
    meta,
    actor: {
      uid: from.uid ?? null,
      name: from.name || from.email?.split('@')[0] || 'User',
      email: from.email ?? null,
      role: from.role || 'customer',
    },
    createdAt: new Date().toISOString(),
  });

  // Logging must never fail the request it describes
  try {
    activityRef.add(doc).catch((error) => {
      logger.error('Failed to record activity', { action, error: error.message });
    });
  } catch (error) {
    logger.error('Failed to record activity', { action, error: error.message });
  }
};

export const activityService = {
  list: async ({ limit = 50, before, entity } = {}) => {
    let query = activityRef.orderBy('createdAt', 'desc');
    if (before) query = query.where('createdAt', '<', before);
    // Filtering by entity happens in memory so no composite index is required
    const snapshot = await query.limit(entity ? Math.min(limit * 5, 500) : limit).get();
    let items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    if (entity) items = items.filter((i) => i.entity === entity).slice(0, limit);
    return items;
  },
};
