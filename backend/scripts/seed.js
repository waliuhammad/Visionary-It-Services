import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, productsRef, categoriesRef } from '../src/config/firebase.js';
import { generateKeywords } from '../src/modules/products/products.service.js';
import { firestore } from '../src/utils/firestore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const isWipe = args.includes('--wipe');
const fileArgIndex = args.indexOf('--file');
const filePath = fileArgIndex !== -1 ? args[fileArgIndex + 1] : path.join(__dirname, '..', 'data', 'products.json');

const wipeCollection = async (collectionRef) => {
  const snapshot = await collectionRef.get();
  const BATCH_SIZE = 450;
  let batches = [];
  let currentBatch = db.batch();
  let count = 0;

  snapshot.docs.forEach((doc) => {
    currentBatch.delete(doc.ref);
    count++;
    if (count % BATCH_SIZE === 0) {
      batches.push(currentBatch.commit());
      currentBatch = db.batch();
    }
  });

  if (count % BATCH_SIZE !== 0) {
    batches.push(currentBatch.commit());
  }

  await Promise.all(batches);
  console.log(`🧹 Wiped ${count} documents from ${collectionRef.id}`);
};

const run = async () => {
  try {
    if (isWipe) {
      console.log('Wiping existing data...');
      await wipeCollection(productsRef);
      await wipeCollection(categoriesRef);
    }

    console.log(`Reading data from ${filePath}...`);
    const data = await fs.readFile(filePath, 'utf-8');
    const products = JSON.parse(data);

    if (!Array.isArray(products)) {
      throw new Error('Data file must contain a JSON array');
    }

    console.log(`Seeding ${products.length} products...`);
    
    // Derive categories
    const categoryCounts = {};

    await firestore.processInBatches(products, (batch, product) => {
      // 1. Prepare product
      const productRef = productsRef.doc(product.slug); // use slug as ID for idempotency/easier updates
      const productData = {
        ...product,
        keywords: generateKeywords(product),
        createdAt: product.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      batch.set(productRef, productData, { merge: true });

      // 2. Count categories
      if (product.category) {
        categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
      }
    });

    console.log(`✅ Products seeded successfully.`);

    // Seed categories
    const categories = Object.keys(categoryCounts).map(name => {
      return {
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        count: categoryCounts[name],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });

    console.log(`Seeding ${categories.length} categories...`);
    
    await firestore.processInBatches(categories, (batch, cat) => {
      const catRef = categoriesRef.doc(cat.slug);
      batch.set(catRef, cat, { merge: true });
    });

    console.log(`✅ Categories seeded successfully.`);
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

run();
