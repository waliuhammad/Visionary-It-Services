import { db, ordersRef, productsRef, usersRef } from '../../config/firebase.js';

export const adminService = {
  getStats: async () => {
    const [ordersSnap, productsSnap, usersSnap] = await Promise.all([
      ordersRef.get(),
      productsRef.get(),
      usersRef.get()
    ]);

    const allOrders = ordersSnap.docs.map(doc => doc.data());
    const allProducts = productsSnap.docs.map(doc => doc.data());
    const allUsers = usersSnap.docs.map(doc => doc.data());

    const paidOrders = allOrders.filter(o => o.paymentStatus === 'paid');
    const revenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const inStockCount = allProducts.filter(p => p.inStock !== false).length;
    const stockLevel = allProducts.length > 0 ? Math.round((inStockCount / allProducts.length) * 100) : 0;

    return {
      revenue,
      orderCount: allOrders.length,
      productCount: allProducts.length,
      userCount: allUsers.length,
      stockLevel
    };
  },

  getChart: async (days) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today

    const pastDate = new Date(now);
    pastDate.setDate(now.getDate() - days + 1); // e.g., 7 days ago

    // Get orders from the past `days`
    const snapshot = await ordersRef
      .where('createdAt', '>=', pastDate.toISOString())
      .get();

    const orders = snapshot.docs.map(doc => doc.data());

    // Group by date
    const chartDataMap = {};
    
    // Initialize all days with 0
    for (let i = 0; i < days; i++) {
      const d = new Date(pastDate);
      d.setDate(pastDate.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      chartDataMap[dateStr] = { date: dateStr, revenue: 0, orders: 0 };
    }

    orders.forEach(o => {
      if (!o.createdAt) return;
      const dateStr = o.createdAt.split('T')[0];
      if (chartDataMap[dateStr]) {
        chartDataMap[dateStr].orders += 1;
        if (o.paymentStatus === 'paid') {
          chartDataMap[dateStr].revenue += (o.total || 0);
        }
      }
    });

    return Object.values(chartDataMap).sort((a, b) => a.date.localeCompare(b.date));
  }
};
