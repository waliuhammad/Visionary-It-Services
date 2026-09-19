import { ordersRef, productsRef, usersRef, analyticsRef, FieldPath } from '../../config/firebase.js';
import { getStats as getLiveStats, isReady } from '../../realtime/hub.js';

const dayKeys = (days) => {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - days + 1);
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    return d.toISOString().slice(0, 10);
  });
};

export const adminService = {
  getStats: async () => {
    // The realtime hub keeps an in-memory copy of the collections once it has synced
    if (isReady()) return getLiveStats();

    const [ordersSnap, productsSnap, usersSnap] = await Promise.all([
      ordersRef.get(),
      productsRef.get(),
      usersRef.get(),
    ]);

    const allOrders = ordersSnap.docs.map(doc => doc.data());
    const allProducts = productsSnap.docs.map(doc => doc.data());

    const revenue = allOrders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    const inStockCount = allProducts.filter(p => p.inStock !== false).length;

    return {
      revenue,
      orderCount: allOrders.length,
      productCount: allProducts.length,
      userCount: usersSnap.size,
      stockLevel: allProducts.length ? Math.round((inStockCount / allProducts.length) * 100) : 0,
    };
  },

  /** Daily revenue and order counts (UTC days). */
  getChart: async (days) => {
    const keys = dayKeys(days);
    const snapshot = await ordersRef.where('createdAt', '>=', `${keys[0]}T00:00:00.000Z`).get();

    const byDay = Object.fromEntries(keys.map(date => [date, { date, revenue: 0, orders: 0 }]));
    snapshot.docs.forEach(doc => {
      const o = doc.data();
      const bucket = byDay[o.createdAt?.slice(0, 10)];
      if (!bucket) return;
      bucket.orders += 1;
      if (o.paymentStatus === 'paid') bucket.revenue += o.total || 0;
    });

    return Object.values(byDay);
  },

  /** Daily storefront traffic recorded by the tracking endpoints. */
  getAnalytics: async (days) => {
    const keys = dayKeys(days);
    const snapshot = await analyticsRef
      .where(FieldPath.documentId(), '>=', keys[0])
      .where(FieldPath.documentId(), '<=', keys[keys.length - 1])
      .get();
    const docs = Object.fromEntries(snapshot.docs.map(d => [d.id, d.data()]));

    const totals = { pageViews: 0, visitors: 0, paths: {}, devices: {}, referrers: {} };
    const daily = keys.map(date => {
      const d = docs[date] || {};
      totals.pageViews += d.pageViews || 0;
      totals.visitors += d.visitors || 0;
      for (const field of ['paths', 'devices', 'referrers']) {
        for (const [k, v] of Object.entries(d[field] || {})) {
          totals[field][k] = (totals[field][k] || 0) + v;
        }
      }
      return { date, pageViews: d.pageViews || 0, visitors: d.visitors || 0 };
    });

    const top = (obj, n = 10, mapKey = k => k) =>
      Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, n).map(([key, count]) => ({ key: mapKey(key), count }));

    return {
      daily,
      totals: { pageViews: totals.pageViews, visitors: totals.visitors },
      topPages: top(totals.paths),
      devices: top(totals.devices),
      referrers: top(totals.referrers, 10, k => k.replace(/_/g, '.')),
    };
  },
};
