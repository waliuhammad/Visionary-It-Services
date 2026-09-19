/**
 * Copy every product image into Cloudinary and point the products at the new URLs.
 *
 *   npm run images:migrate              # upload + update Firestore + update the JSON data files
 *   npm run images:migrate -- --dry-run # only report what would happen
 *
 * Sources handled:
 *   - remote URLs (https://...)          -> fetched by Cloudinary
 *   - site paths (/images/products/x.webp) -> read from ../public or backend/data/images if present
 * Images already on this Cloudinary account are skipped, so the script can be re-run safely.
 */
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { productsRef } from '../src/config/firebase.js';
import { isCloudinaryConfigured } from '../src/config/cloudinary.js';
import { cloudinaryFolder, isOwnCloudinaryUrl, uploadFromSource } from '../src/utils/cloudinary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.join(__dirname, '..');
const dryRun = process.argv.includes('--dry-run');
const CONCURRENCY = 5;

const JSON_FILES = [
  path.join(backendDir, 'data', 'products.json'),
  path.join(backendDir, '..', 'src', 'data', 'products.json'),
];
const LOCAL_ROOTS = [
  path.join(backendDir, '..', 'public'),
  path.join(backendDir, 'data'),
];

const resolveSource = (url) => {
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) {
    for (const root of LOCAL_ROOTS) {
      const candidate = path.join(root, url);
      if (existsSync(candidate)) return candidate;
    }
  }
  return null;
};

const mapLimit = async (items, limit, fn) => {
  let index = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (index < items.length) {
      const i = index++;
      await fn(items[i], i);
    }
  });
  await Promise.all(workers);
};

const run = async () => {
  if (!isCloudinaryConfigured) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env');
  }

  const snapshot = await productsRef.get();
  const folder = cloudinaryFolder('products');
  const replacements = new Map(); // old url -> new url
  const report = { uploaded: 0, alreadyOnCloudinary: 0, missing: [], failed: [] };

  console.log(`${dryRun ? '[dry run] ' : ''}Checking ${snapshot.size} products...`);

  await mapLimit(snapshot.docs, CONCURRENCY, async (doc) => {
    const product = doc.data();
    const urls = [product.image, ...(product.images || [])].filter(Boolean);
    const updates = {};

    for (const [i, url] of urls.entries()) {
      if (isOwnCloudinaryUrl(url)) {
        report.alreadyOnCloudinary++;
        continue;
      }
      const source = resolveSource(url);
      if (!source) {
        report.missing.push({ id: doc.id, name: product.name, url });
        continue;
      }
      if (dryRun) {
        report.uploaded++;
        continue;
      }
      try {
        const result = replacements.get(url) || await uploadFromSource(source, {
          folder,
          publicId: i === 0 ? doc.id : `${doc.id}-${i}`,
        });
        replacements.set(url, result);
        if (i === 0) updates.image = result.url;
        else (updates.images ||= [...(product.images || [])])[i - 1] = result.url;
        report.uploaded++;
      } catch (error) {
        report.failed.push({ id: doc.id, name: product.name, url, error: error.message });
      }
    }

    if (Object.keys(updates).length) {
      await doc.ref.update({ ...updates, updatedAt: new Date().toISOString() });
      process.stdout.write('.');
    }
  });

  // Keep the static site's data files in sync with Firestore
  if (!dryRun && replacements.size) {
    for (const file of JSON_FILES) {
      if (!existsSync(file)) continue;
      const products = JSON.parse(await fs.readFile(file, 'utf-8'));
      let changed = 0;
      for (const p of products) {
        const next = replacements.get(p.image) || replacements.get(p.image?.replace(/^\/images\/products\/(?=https?:)/, ''));
        if (next) {
          p.image = next.url;
          changed++;
        }
      }
      await fs.writeFile(file, `${JSON.stringify(products, null, 2)}\n`);
      console.log(`\nUpdated ${changed} image URLs in ${path.relative(path.join(backendDir, '..'), file)}`);
    }
  }

  console.log('\n──────── Summary ────────');
  console.log(`${dryRun ? 'Would upload' : 'Uploaded'}: ${report.uploaded}`);
  console.log(`Already on Cloudinary: ${report.alreadyOnCloudinary}`);
  console.log(`Missing source file: ${report.missing.length}`);
  console.log(`Failed: ${report.failed.length}`);

  if (report.missing.length || report.failed.length) {
    const reportFile = path.join(backendDir, 'image-migration-report.json');
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
    console.log(`Details written to ${reportFile}`);
    if (report.missing.length) {
      console.log('Tip: put missing files in public/images/products/ (same file names) and run the script again.');
    }
  }
};

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Image migration failed:', error.message);
    process.exit(1);
  });
