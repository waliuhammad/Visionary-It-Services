// =============================================================================
// Mock Data for admin endpoints that DON'T EXIST yet in the backend.
// Each section has a TODO comment naming the real endpoint that needs to exist
// and the response shape it should return.
// =============================================================================

// TODO: Create GET /api/v1/admin/dashboard/stats
// Should aggregate and return: { revenue, orderCount, productCount, userCount, stockLevel }
// Revenue = sum of all orders with paymentStatus === 'paid'
// stockLevel = percentage of products where inStock === true
export const mockDashboardStats = {
  revenue: 485200,
  orderCount: 127,
  productCount: 226,
  userCount: 54,
  stockLevel: 92,
};

// TODO: Create GET /api/v1/admin/dashboard/chart?days=7
// Should return an array of { date (ISO string), revenue (number), orders (number) }
// for the last N days, computed from real order data grouped by createdAt date.
export const mockChartData = [
  { date: '2026-09-11', revenue: 45000, orders: 8 },
  { date: '2026-09-12', revenue: 62000, orders: 12 },
  { date: '2026-09-13', revenue: 38000, orders: 6 },
  { date: '2026-09-14', revenue: 71000, orders: 15 },
  { date: '2026-09-15', revenue: 55000, orders: 10 },
  { date: '2026-09-16', revenue: 82000, orders: 18 },
  { date: '2026-09-17', revenue: 67000, orders: 14 },
];

// TODO: Create PATCH /api/v1/contact/:id — should update { read: true } on the message doc.
// TODO: Create DELETE /api/v1/contact/:id — should delete the message doc and return 204.
// (Currently the backend only has POST / and GET / for contact messages.)

// TODO: Create GET /api/v1/settings and PATCH /api/v1/settings
// GET should return the full settings object. PATCH should accept partial updates.
// The settings doc should live in Firestore at e.g. settings/site.
export const mockSettings = {
  freeShippingThreshold: 5000,
  shippingFee: 250,
  heroBanners: [
    {
      id: '1',
      title: 'Premium Software Licenses',
      caption: 'Enterprise-grade tools at unbeatable prices',
      image: '/assets/pexels-photo-270373-scaled-1-600x400.jpeg',
    },
    {
      id: '2',
      title: 'Web Templates Collection',
      caption: 'Launch faster with production-ready templates',
      image: '/assets/pexels-photo-270637-scaled-1-768x510.jpeg',
    },
    {
      id: '3',
      title: 'SaaS Tools Bundle',
      caption: 'Everything your team needs in one place',
      image: '/assets/pexels-photo-1181263-scaled-1-768x513.jpeg',
    },
  ],
};

// TODO: Create POST /api/v1/categories — should create a new category doc in Firestore.
// TODO: Create DELETE /api/v1/categories/:id — should delete the category doc.
// (Currently the backend only has GET / for categories.)
