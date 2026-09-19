/**
 * Realtime hub for the admin panel.
 *
 * - Watches Firestore collections with onSnapshot and keeps an in-memory copy,
 *   so dashboard stats are always current without re-reading the database.
 * - Tracks live storefront visitors (anonymous heartbeats, kept in memory only).
 * - Pushes every change to connected admins over Server-Sent Events (SSE).
 *
 * Firestore is the source of truth, so changes made anywhere (API, Firebase Console,
 * scripts) are picked up. Visitor presence is per process: run a single API instance.
 */
import {
  ordersRef, productsRef, usersRef, contactMessagesRef, categoriesRef,
  newsletterSubscribersRef, settingsRef, activityRef,
} from '../config/firebase.js';
import { logger } from '../utils/logger.js';

const WATCHED = {
  orders: ordersRef,
  products: productsRef,
  users: usersRef,
  contactMessages: contactMessagesRef,
  categories: categoriesRef,
  newsletterSubscribers: newsletterSubscribersRef,
};

const VISITOR_TIMEOUT_MS = 70_000;
const HEARTBEAT_MS = 25_000;
const MAX_STREAM_MS = 55 * 60_000; // clients reconnect (and are re-authenticated) hourly
const RECENT_ACTIVITY = 30;

const cache = Object.fromEntries(Object.keys(WATCHED).map((name) => [name, new Map()]));
const ready = new Set();
const clients = new Map(); // id -> { res, user, connectedAt }
const visitors = new Map(); // sid -> { sid, path, title, referrer, device, startedAt, lastSeen, pageViews }
let recentActivity = [];
let settings = null;
let unsubscribers = [];
let timers = [];
let statsTimer = null;
let visitorsTimer = null;
let nextClientId = 1;

// ─── Helpers ──────────────────────────────────────────────

const todayKey = () => new Date().toISOString().slice(0, 10);

/** Only the fields the admin UI needs, so events stay small. */
const summarize = (collection, id, data) => {
  if (!data) return null;
  switch (collection) {
    case 'products':
      return { id, name: data.name, category: data.category, price: data.price, image: data.image, inStock: data.inStock, bestSeller: data.bestSeller };
    case 'orders':
      return {
        id, orderNumber: data.orderNumber, status: data.status, paymentStatus: data.paymentStatus,
        total: data.total, currency: data.currency, customer: data.customer?.fullName, itemCount: data.items?.length || 0,
        createdAt: data.createdAt,
      };
    case 'users':
      return { uid: id, fullName: data.fullName, email: data.email, role: data.role, createdAt: data.createdAt };
    case 'contactMessages':
      return { id, name: data.name, email: data.email, subject: data.subject, read: data.read, createdAt: data.createdAt };
    default:
      return { id, ...data };
  }
};

const send = (res, event, data) => {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
};

const broadcast = (event, data) => {
  for (const { res } of clients.values()) send(res, event, data);
};

// ─── Derived state ────────────────────────────────────────

export const getStats = () => {
  const orders = [...cache.orders.values()];
  const products = [...cache.products.values()];
  const today = todayKey();

  const paid = orders.filter((o) => o.paymentStatus === 'paid');
  const todays = orders.filter((o) => o.createdAt?.startsWith(today));
  const inStock = products.filter((p) => p.inStock !== false).length;

  return {
    revenue: paid.reduce((sum, o) => sum + (o.total || 0), 0),
    orderCount: orders.length,
    pendingOrders: orders.filter((o) => (o.status || 'pending') === 'pending').length,
    todayOrders: todays.length,
    todayRevenue: todays.filter((o) => o.paymentStatus === 'paid').reduce((sum, o) => sum + (o.total || 0), 0),
    productCount: products.length,
    outOfStock: products.length - inStock,
    stockLevel: products.length ? Math.round((inStock / products.length) * 100) : 0,
    userCount: cache.users.size,
    categoryCount: cache.categories.size,
    unreadMessages: [...cache.contactMessages.values()].filter((m) => !m.read).length,
    subscribers: [...cache.newsletterSubscribers.values()].filter((s) => s.status === 'subscribed').length,
    liveVisitors: visitors.size,
    adminsOnline: new Set([...clients.values()].map((c) => c.user.uid)).size,
    updatedAt: new Date().toISOString(),
  };
};

export const isReady = () => ready.size === Object.keys(WATCHED).length;

export const getVisitors = () =>
  [...visitors.values()]
    .map(({ sid, path, title, referrer, device, startedAt, lastSeen, pageViews }) => ({
      id: sid.slice(0, 8), path, title, referrer, device, startedAt, lastSeen, pageViews,
    }))
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt));

export const getRecentActivity = () => recentActivity;

const scheduleStats = () => {
  if (statsTimer) return;
  statsTimer = setTimeout(() => {
    statsTimer = null;
    if (clients.size) broadcast('stats', getStats());
  }, 500);
};

const scheduleVisitors = () => {
  if (visitorsTimer) return;
  visitorsTimer = setTimeout(() => {
    visitorsTimer = null;
    if (clients.size) broadcast('visitors', getVisitors());
    scheduleStats();
  }, 1000);
};

// ─── Visitor tracking ─────────────────────────────────────

export const touchVisitor = ({ sid, path, title, referrer, device, isPageView }) => {
  const now = new Date().toISOString();
  const existing = visitors.get(sid);
  const isNew = !existing;
  const visitor = existing || { sid, startedAt: now, pageViews: 0, referrer: referrer || null, device };
  const pathChanged = visitor.path !== path;

  Object.assign(visitor, { path, title: title || visitor.title, lastSeen: now });
  if (isPageView) visitor.pageViews += 1;
  visitors.set(sid, visitor);

  if (isNew || pathChanged) scheduleVisitors();
  return { isNew };
};

const pruneVisitors = () => {
  const cutoff = Date.now() - VISITOR_TIMEOUT_MS;
  let removed = false;
  for (const [sid, v] of visitors) {
    if (Date.parse(v.lastSeen) < cutoff) {
      visitors.delete(sid);
      removed = true;
    }
  }
  if (removed) scheduleVisitors();
};

// ─── Firestore watchers ───────────────────────────────────

const watchCollection = (name, ref) =>
  ref.onSnapshot(
    (snapshot) => {
      const initial = !ready.has(name);
      for (const change of snapshot.docChanges()) {
        const { id } = change.doc;
        if (change.type === 'removed') {
          cache[name].delete(id);
        } else {
          cache[name].set(id, change.doc.data());
        }
        if (!initial) {
          broadcast('change', {
            collection: name,
            type: change.type, // added | modified | removed
            id,
            data: change.type === 'removed' ? null : summarize(name, id, change.doc.data()),
            at: new Date().toISOString(),
          });
        }
      }
      if (initial) {
        ready.add(name);
        logger.info(`Realtime: watching ${name} (${snapshot.size} docs)`);
      }
      scheduleStats();
    },
    (error) => logger.error(`Realtime watcher for ${name} failed`, { error: error.message })
  );

const watchActivity = () => {
  let initial = true;
  return activityRef.orderBy('createdAt', 'desc').limit(RECENT_ACTIVITY).onSnapshot(
    (snapshot) => {
      recentActivity = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (!initial) {
        snapshot.docChanges()
          .filter((c) => c.type === 'added')
          .reverse()
          .forEach((c) => broadcast('activity', { id: c.doc.id, ...c.doc.data() }));
      }
      initial = false;
    },
    (error) => logger.error('Realtime watcher for activityLog failed', { error: error.message })
  );
};

const watchSettings = () => {
  let initial = true;
  return settingsRef.doc('site').onSnapshot(
    (doc) => {
      settings = doc.exists ? doc.data() : null;
      if (!initial) broadcast('change', { collection: 'settings', type: 'modified', id: 'site', data: settings, at: new Date().toISOString() });
      initial = false;
    },
    (error) => logger.error('Realtime watcher for settings failed', { error: error.message })
  );
};

export const startRealtime = () => {
  if (unsubscribers.length) return;
  unsubscribers = [
    ...Object.entries(WATCHED).map(([name, ref]) => watchCollection(name, ref)),
    watchActivity(),
    watchSettings(),
  ];
  timers = [setInterval(pruneVisitors, 15_000)];
  timers.forEach((t) => t.unref());
};

export const stopRealtime = () => {
  unsubscribers.forEach((unsubscribe) => unsubscribe());
  unsubscribers = [];
  timers.forEach(clearInterval);
  timers = [];
  for (const { res } of clients.values()) res.end();
  clients.clear();
};

// ─── SSE endpoint ─────────────────────────────────────────

export const connectStream = (req, res) => {
  const id = nextClientId++;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no', // disable Nginx buffering
  });
  res.write('retry: 3000\n\n');

  clients.set(id, { res, user: req.user, connectedAt: new Date().toISOString() });
  send(res, 'snapshot', {
    stats: getStats(),
    visitors: getVisitors(),
    activity: recentActivity,
    ready: isReady(),
  });
  scheduleStats(); // adminsOnline changed

  const heartbeat = setInterval(() => res.write(`: ping ${Date.now()}\n\n`), HEARTBEAT_MS);
  const expiry = setTimeout(() => res.end(), MAX_STREAM_MS);

  req.on('close', () => {
    clearInterval(heartbeat);
    clearTimeout(expiry);
    clients.delete(id);
    scheduleStats();
  });
};
