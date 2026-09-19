/**
 * Seed Firestore with products and categories.
 *
 *   npm run seed                         # upsert from data/products.json
 *   npm run seed:wipe                    # delete products + categories first
 *   node scripts/seed.js --file ./x.json # custom data file
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { productsRef, categoriesRef } from '../src/config/firebase.js';
import { generateKeywords } from '../src/modules/products/products.service.js';
import { firestore } from '../src/utils/firestore.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const isWipe = args.includes('--wipe');
const fileArgIndex = args.indexOf('--file');
const filePath = fileArgIndex !== -1
  ? path.resolve(args[fileArgIndex + 1])
  : path.join(__dirname, '..', 'data', 'products.json');

// Known inconsistencies in the source data
const CATEGORY_ALIASES = { 'Digital Services': 'Digital Service' };

const slugify = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const normalizeImage = (image = '') => {
  // Some entries look like "/images/products/https://..." — keep the absolute URL
  const absolute = image.match(/https?:\/\/.*/);
  return absolute ? absolute[0] : image;
};

const wipeCollection = async (collectionRef) => {
  const snapshot = await collectionRef.get();
  await firestore.processInBatches(snapshot.docs, (batch, doc) => batch.delete(doc.ref));
  console.log(`🧹 Wiped ${snapshot.size} documents from ${collectionRef.id}`);
};

const run = async () => {
  if (isWipe) {
    console.log('Wiping existing data...');
    await wipeCollection(productsRef);
    await wipeCollection(categoriesRef);
  }

  console.log(`Reading data from ${filePath}...`);
  const products = JSON.parse(await fs.readFile(filePath, 'utf-8'));

  if (!Array.isArray(products)) {
    throw new Error('Data file must contain a JSON array');
  }

  const now = new Date().toISOString();
  const categoryCounts = {};

  const docs = products.map((raw) => {
    const category = CATEGORY_ALIASES[raw.category] || raw.category;
    const product = {
      ...raw,
      slug: raw.slug || slugify(raw.name),
      category,
      image: normalizeImage(raw.image),
      shortDescription: raw.shortDescription || raw.description,
      inStock: raw.inStock ?? true,
      bestSeller: raw.bestSeller ?? false,
      currency: raw.currency || 'PKR',
      deliveryType: raw.deliveryType || 'digital',
      tags: raw.tags || [],
      createdAt: raw.createdAt || now,
      updatedAt: now,
    };
    delete product.id;
    product.keywords = generateKeywords(product);

    if (category) categoryCounts[category] = (categoryCounts[category] || 0) + 1;

    // The source id is unique (slugs are not), so it is used as the document id
    return { id: String(raw.id || product.slug), data: product };
  });

  console.log(`Seeding ${docs.length} products...`);
  await firestore.processInBatches(docs, (batch, { id, data }) => {
    batch.set(productsRef.doc(id), data, { merge: true });
  });
  console.log('✅ Products seeded.');

  const categories = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    slug: slugify(name),
    count,
    createdAt: now,
    updatedAt: now,
  }));

  console.log(`Seeding ${categories.length} categories...`);
  await firestore.processInBatches(categories, (batch, cat) => {
    batch.set(categoriesRef.doc(cat.slug), cat, { merge: true });
  });
  console.log('✅ Categories seeded.');
};

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  });
