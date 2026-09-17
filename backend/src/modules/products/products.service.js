import { productsRef } from '../../config/firebase.js';
import { ApiError } from '../../utils/ApiError.js';
import { logger } from '../../utils/logger.js';

/**
 * Tokenize string for poor-man's search
 */
export const generateKeywords = (product) => {
  const text = `${product.name} ${product.shortDescription} ${product.category} ${(product.tags || []).join(' ')}`.toLowerCase();
  // Keep words >= 3 chars
  const words = text.match(/\b\w{3,}\b/g) || [];
  // Dedupe and cap at 60
  return [...new Set(words)].slice(0, 60);
};

export const productsService = {
  find: async (queryOpts) => {
    let query = productsRef;

    if (queryOpts.category) {
      query = query.where('category', '==', queryOpts.category);
    }
    
    if (queryOpts.bestSeller !== undefined) {
      query = query.where('bestSeller', '==', queryOpts.bestSeller);
    }

    if (queryOpts.search) {
      // Lowercase search term, take first token as primary search due to array-contains limitation
      const searchTokens = queryOpts.search.toLowerCase().match(/\b\w{3,}\b/g) || [];
      if (searchTokens.length > 0) {
        query = query.where('keywords', 'array-contains', searchTokens[0]);
      }
    }

    // Apply sorting
    switch (queryOpts.sort) {
      case 'price_asc':
        query = query.orderBy('price', 'asc');
        break;
      case 'price_desc':
        query = query.orderBy('price', 'desc');
        break;
      case 'name_asc':
        query = query.orderBy('name', 'asc');
        break;
      case 'newest':
        query = query.orderBy('createdAt', 'desc');
        break;
      case 'featured':
        query = query.orderBy('bestSeller', 'desc').orderBy('createdAt', 'desc');
        break;
      default:
        query = query.orderBy('createdAt', 'desc');
    }

    // Since we applied where filters and orderBys, composite indexes are required!
    // Ex: category (ASC) + price (ASC), keywords (ARRAY) + price (ASC)

    // Note: minPrice/maxPrice are best handled client-side or as post-fetch filters
    // if other inequality filters (or array-contains) are used, due to Firestore limits.
    // For simplicity, we filter them post-query if search or other orderings are used.

    const snapshot = await query.get();
    let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (queryOpts.minPrice !== undefined) {
      results = results.filter(p => p.price >= queryOpts.minPrice);
    }
    if (queryOpts.maxPrice !== undefined) {
      results = results.filter(p => p.price <= queryOpts.maxPrice);
    }

    // In-memory pagination for simplified cursor logic given the post-filters
    const startIndex = (queryOpts.page - 1) * queryOpts.limit;
    const paginatedResults = results.slice(startIndex, startIndex + queryOpts.limit);
    
    // Remove the keywords array from response to save bandwidth
    paginatedResults.forEach(p => delete p.keywords);

    return {
      data: paginatedResults,
      meta: {
        page: queryOpts.page,
        limit: queryOpts.limit,
        total: results.length,
        hasMore: startIndex + queryOpts.limit < results.length
      }
    };
  },

  findById: async (id) => {
    const doc = await productsRef.doc(id).get();
    if (!doc.exists) throw ApiError.notFound('Product not found');
    const data = doc.data();
    delete data.keywords;
    return { id: doc.id, ...data };
  },

  findBySlug: async (slug) => {
    const snapshot = await productsRef.where('slug', '==', slug).limit(1).get();
    if (snapshot.empty) throw ApiError.notFound('Product not found');
    const doc = snapshot.docs[0];
    const data = doc.data();
    delete data.keywords;
    return { id: doc.id, ...data };
  },
  
  findFeatured: async () => {
    const snapshot = await productsRef.where('bestSeller', '==', true).limit(6).get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      delete data.keywords;
      return { id: doc.id, ...data };
    });
  },

  findRelated: async (id) => {
    const doc = await productsRef.doc(id).get();
    if (!doc.exists) throw ApiError.notFound('Product not found');
    
    // Simple related logic: same category, limit 4
    const category = doc.data().category;
    const snapshot = await productsRef.where('category', '==', category).limit(5).get();
    
    return snapshot.docs
      .filter(d => d.id !== id)
      .slice(0, 4)
      .map(d => {
        const data = d.data();
        delete data.keywords;
        return { id: d.id, ...data };
      });
  },

  create: async (data) => {
    // Check slug uniqueness
    const existing = await productsRef.where('slug', '==', data.slug).limit(1).get();
    if (!existing.empty) throw ApiError.conflict('Slug already in use');

    const productData = {
      ...data,
      keywords: generateKeywords(data),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await productsRef.add(productData);
    logger.info('Product created', { id: docRef.id });
    
    delete productData.keywords;
    return { id: docRef.id, ...productData };
  },

  update: async (id, data) => {
    const docRef = productsRef.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) throw ApiError.notFound('Product not found');

    const updateData = { ...data, updatedAt: new Date().toISOString() };
    
    // Recompute keywords if fields changed
    if (data.name || data.shortDescription || data.category || data.tags) {
      const current = doc.data();
      updateData.keywords = generateKeywords({ ...current, ...data });
    }

    await docRef.update(updateData);
    logger.info('Product updated', { id });
    
    const updated = (await docRef.get()).data();
    delete updated.keywords;
    return { id, ...updated };
  },

  delete: async (id) => {
    const docRef = productsRef.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) throw ApiError.notFound('Product not found');

    await docRef.delete();
    logger.info('Product deleted', { id });
  }
};
