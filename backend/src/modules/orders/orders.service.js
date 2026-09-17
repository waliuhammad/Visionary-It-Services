import { ordersRef, productsRef, countersRef } from '../../config/firebase.js';
import { ApiError } from '../../utils/ApiError.js';
import { logger } from '../../utils/logger.js';
import { firestore } from '../../utils/firestore.js';

/**
 * Generate a sequential order number using a transaction.
 */
const generateOrderNumber = async () => {
  const counterDocRef = countersRef.doc('orders');

  return await firestore.runTransaction(async (transaction) => {
    const doc = await transaction.get(counterDocRef);
    let newCount = 1;

    if (doc.exists) {
      newCount = doc.data().count + 1;
      transaction.update(counterDocRef, { count: newCount });
    } else {
      transaction.set(counterDocRef, { count: newCount });
    }

    // Format: VIS-000123
    return `VIS-${newCount.toString().padStart(6, '0')}`;
  });
};

export const ordersService = {
  create: async (userId, data) => {
    const { customer, items, paymentMethod } = data;
    
    // 1. Fetch all products to verify prices and stock
    const productIds = items.map(item => item.productId);
    
    // Max 30 products due to 'in' query limit, which is fine for a normal cart
    if (productIds.length > 30) {
      throw ApiError.badRequest('Too many items in order');
    }

    const productsSnapshot = await productsRef.where('__name__', 'in', productIds).get();
    
    if (productsSnapshot.docs.length !== productIds.length) {
      throw ApiError.badRequest('One or more products in the cart are invalid');
    }

    const productMap = {};
    productsSnapshot.docs.forEach(doc => {
      productMap[doc.id] = { id: doc.id, ...doc.data() };
    });

    // 2. Build the verified order items and calculate totals
    const verifiedItems = [];
    let subtotal = 0;
    const currency = 'PKR'; // System default currency

    for (const item of items) {
      const product = productMap[item.productId];
      
      if (!product.inStock) {
        throw ApiError.badRequest(`Product ${product.name} is out of stock`);
      }

      const unitPrice = product.price;
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      verifiedItems.push({
        productId: product.id,
        name: product.name,
        image: product.image,
        category: product.category,
        unitPrice,
        quantity: item.quantity,
        lineTotal
      });
    }

    // 3. Tax calculation (example: 0% tax for digital products, adjust as needed)
    const tax = 0;
    const total = subtotal + tax;

    // 4. Generate order number
    const orderNumber = await generateOrderNumber();

    // 5. Construct order document
    const orderDoc = {
      orderNumber,
      userId: userId || null,
      customer,
      items: verifiedItems,
      currency,
      subtotal,
      tax,
      total,
      paymentMethod,
      paymentStatus: 'unpaid',
      status: 'pending',
      history: [{
        status: 'pending',
        timestamp: new Date().toISOString(),
        note: 'Order placed'
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 6. Save order
    const docRef = await ordersRef.add(orderDoc);
    logger.info('Order created', { orderId: docRef.id, orderNumber });

    return { id: docRef.id, ...orderDoc };
  },

  findMine: async (userId) => {
    const snapshot = await ordersRef.where('userId', '==', userId).orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  findById: async (id, userId, role) => {
    const doc = await ordersRef.doc(id).get();
    if (!doc.exists) throw ApiError.notFound('Order not found');
    
    const data = doc.data();
    
    // Access control: only owner or admin can view
    if (role !== 'admin' && data.userId !== userId) {
      throw ApiError.forbidden('You do not have permission to view this order');
    }
    
    return { id: doc.id, ...data };
  },

  findAll: async () => {
    const snapshot = await ordersRef.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  updateStatus: async (id, { status, paymentStatus }) => {
    const docRef = ordersRef.doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) throw ApiError.notFound('Order not found');
    
    const currentData = doc.data();
    const updateData = { updatedAt: new Date().toISOString() };
    const historyEntry = {
      timestamp: updateData.updatedAt,
      note: ''
    };

    if (status && status !== currentData.status) {
      updateData.status = status;
      historyEntry.status = status;
      historyEntry.note = `Status changed to ${status}`;
    }

    if (paymentStatus && paymentStatus !== currentData.paymentStatus) {
      updateData.paymentStatus = paymentStatus;
      historyEntry.note += (historyEntry.note ? ' | ' : '') + `Payment status changed to ${paymentStatus}`;
      if (!historyEntry.status) historyEntry.status = currentData.status;
    }

    if (updateData.status || updateData.paymentStatus) {
      // Append to history
      const newHistory = [...(currentData.history || []), historyEntry];
      updateData.history = newHistory;
      
      await docRef.update(updateData);
      logger.info('Order status updated', { id, status, paymentStatus });
    }

    return { id, ...currentData, ...updateData };
  }
};
