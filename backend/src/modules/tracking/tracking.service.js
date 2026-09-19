import { analyticsRef, FieldValue } from '../../config/firebase.js';
import { touchVisitor } from '../../realtime/hub.js';
import { logger } from '../../utils/logger.js';

// Unique visitors per day, per process (reset at midnight UTC)
let seenDay = null;
let seenToday = new Set();

const deviceFromUserAgent = (ua = '') => {
  if (/bot|crawl|spider|slurp|preview/i.test(ua)) return 'bot';
  if (/ipad|tablet/i.test(ua)) return 'tablet';
  if (/mobi|android|iphone/i.test(ua)) return 'mobile';
  return 'desktop';
};

const referrerHost = (referrer) => {
  try {
    return referrer ? new URL(referrer).hostname : null;
  } catch {
    return null;
  }
};

// Firestore map keys: keep them short and free of characters that need escaping
const pathKey = (path) => path.split('?')[0].replace(/[^A-Za-z0-9/_-]/g, '_').slice(0, 100) || '/';

const recordDaily = ({ path, referrer, device, sid }) => {
  const day = new Date().toISOString().slice(0, 10);
  if (day !== seenDay) {
    seenDay = day;
    seenToday = new Set();
  }
  const isNewVisitor = !seenToday.has(sid);
  seenToday.add(sid);

  const host = referrerHost(referrer);
  analyticsRef.doc(day).set({
    date: day,
    pageViews: FieldValue.increment(1),
    ...(isNewVisitor && { visitors: FieldValue.increment(1) }),
    paths: { [pathKey(path)]: FieldValue.increment(1) },
    devices: { [device]: FieldValue.increment(1) },
    ...(host && isNewVisitor && { referrers: { [host.replace(/\./g, '_')]: FieldValue.increment(1) } }),
    updatedAt: new Date().toISOString(),
  }, { merge: true }).catch((error) => logger.warn('Failed to record page view', { error: error.message }));
};

export const trackingService = {
  pageView: ({ sid, path, title, referrer }, userAgent) => {
    const device = deviceFromUserAgent(userAgent);
    if (device === 'bot') return;
    touchVisitor({ sid, path, title, referrer: referrerHost(referrer), device, isPageView: true });
    recordDaily({ path, referrer, device, sid });
  },

  heartbeat: ({ sid, path, title }, userAgent) => {
    const device = deviceFromUserAgent(userAgent);
    if (device === 'bot') return;
    touchVisitor({ sid, path, title, device, isPageView: false });
  },
};
