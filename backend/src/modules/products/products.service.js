import { productsRef } from '../../config/firebase.js';
import { ApiError } from '../../utils/ApiError.js';
import { logger } from '../../utils/logger.js';
import { destroyByUrls } from '../../utils/cloudinary.js';

const imageUrls = (p = {}) => [p.image, ...(p.images || [])].filter(Boolean);

/**
 * Tokenize string for poor-man's search
 */
export const generateKeywords = (product) => {
  const text = [product.name, product.shortDescription || product.description, product.category, ...(product.tags || [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  // Keep words >= 3 chars
  const words = text.match(/\b\w{3,}\b/g) || [];
  // Dedupe and cap at 60
  return [...new Set(words)].slice(0, 60);
};

export const productsService = {
  find: async (queryOpts) => {
    // The catalogue is small (a few hundred items), so filtering and sorting happen in memory.
    // This keeps every filter/sort combination working without composite Firestore indexes.
    let results = (await productsRef.get()).docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (queryOpts.category) {
      const category = queryOpts.category.toLowerCase();
      results = results.filter(p => p.category?.toLowerCase() === category);
    }
    if (queryOpts.bestSeller !== undefined) {
      results = results.filter(p => Boolean(p.bestSeller) === queryOpts.bestSeller);
    }
    if (queryOpts.search) {
      const tokens = queryOpts.search.toLowerCase().match(/\b\w{2,}\b/g) || [];
      results = results.filter(p => {
        const haystack = `${p.name} ${p.description || ''} ${p.category || ''} ${(p.keywords || []).join(' ')}`.toLowerCase();
        return tokens.every(t => haystack.includes(t));
      });
    }
    if (queryOpts.minPrice !== undefined) {
      results = results.filter(p => p.price >= queryOpts.minPrice);
    }
    if (queryOpts.maxPrice !== undefined) {
      results = results.filter(p => p.price <= queryOpts.maxPrice);
    }

    const byNewest = (a, b) => (b.createdAt || '').localeCompare(a.createdAt || '');
    const sorters = {
      price_asc: (a, b) => a.price - b.price,
      price_desc: (a, b) => b.price - a.price,
      name_asc: (a, b) => a.name.localeCompare(b.name),
      newest: byNewest,
      featured: (a, b) => Number(Boolean(b.bestSeller)) - Number(Boolean(a.bestSeller)) || byNewest(a, b),
    };
    results.sort(sorters[queryOpts.sort] || byNewest);

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
    if (data.name || data.shortDescription || data.description || data.category || data.tags) {
      const current = doc.data();
      updateData.keywords = generateKeywords({ ...current, ...data });
    }

    await docRef.update(updateData);
    logger.info('Product updated', { id });

    // Remove Cloudinary images this product no longer uses
    if (data.image !== undefined || data.images !== undefined) {
      const kept = new Set(imageUrls({ ...doc.data(), ...data }));
      destroyByUrls(imageUrls(doc.data()).filter(url => !kept.has(url)));
    }
    
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
    destroyByUrls(imageUrls(doc.data()));
    return { id, ...doc.data() };
  }
};
