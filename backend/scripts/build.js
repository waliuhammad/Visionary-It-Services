import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const copyRecursive = async (src, dest) => {
  try {
    const stats = await fs.stat(src);
    const isDirectory = stats.isDirectory();

    if (isDirectory) {
      await fs.mkdir(dest, { recursive: true });
      const files = await fs.readdir(src);
      for (const file of files) {
        await copyRecursive(path.join(src, file), path.join(dest, file));
      }
    } else {
      await fs.copyFile(src, dest);
    }
  } catch (err) {
    // Ignore if source doesn't exist
    if (err.code !== 'ENOENT') throw err;
  }
};

const run = async () => {
  console.log('🔨 Building production distribution...');

  try {
    // 1. Clean dist
    console.log('Cleaning dist directory...');
    await fs.rm(distDir, { recursive: true, force: true });
    await fs.mkdir(distDir);

    // 2. Copy directories
    console.log('Copying source files...');
    await copyRecursive(path.join(rootDir, 'src'), path.join(distDir, 'src'));
    await copyRecursive(path.join(rootDir, 'scripts'), path.join(distDir, 'scripts'));
    await copyRecursive(path.join(rootDir, 'data'), path.join(distDir, 'data'));

    // 3. Copy files
    console.log('Copying configuration files...');
    await fs.copyFile(path.join(rootDir, '.env.example'), path.join(distDir, '.env.example'));
    await fs.copyFile(path.join(rootDir, 'ecosystem.config.cjs'), path.join(distDir, 'ecosystem.config.cjs'));
    await fs.copyFile(path.join(rootDir, 'README.md'), path.join(distDir, 'README.md'));
    await fs.copyFile(path.join(rootDir, 'DEPLOY-HOSTINGER.md'), path.join(distDir, 'DEPLOY-HOSTINGER.md'));

    // 4. Transform package.json
    console.log('Generating production package.json...');
    const pkgData = await fs.readFile(path.join(rootDir, 'package.json'), 'utf-8');
    const pkg = JSON.parse(pkgData);
    
    // Remove dev tools and scripts for production
    delete pkg.devDependencies;
    pkg.scripts = {
      start: 'node src/server.js'
    };

    await fs.writeFile(path.join(distDir, 'package.json'), JSON.stringify(pkg, null, 2));

    console.log('✅ Build complete! Production artifacts in dist/');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
};

run();
