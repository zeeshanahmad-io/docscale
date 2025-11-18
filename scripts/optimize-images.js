import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Simple image optimizer: reads images from public/images and writes
// WebP and AVIF responsive variants into public/images/optimized.
// Usage: node scripts/optimize-images.js

const INPUT_DIR = path.join(process.cwd(), 'public', 'images');
const OUTPUT_DIR = path.join(INPUT_DIR, 'optimized');
const widths = [480, 800, 1200, 1600];

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) return;

  const name = path.basename(file, ext);
  const inputPath = path.join(INPUT_DIR, file);

  for (const width of widths) {
    const outWebp = path.join(OUTPUT_DIR, `${name}-${width}.webp`);
    const outAvif = path.join(OUTPUT_DIR, `${name}-${width}.avif`);

    try {
      await sharp(inputPath)
        .resize({ width })
        .webp({ quality: 80 })
        .toFile(outWebp);
    } catch (err) {
      console.error('Failed to write', outWebp, err);
    }

    try {
      await sharp(inputPath)
        .resize({ width })
        .avif({ quality: 50 })
        .toFile(outAvif);
    } catch (err) {
      console.error('Failed to write', outAvif, err);
    }
  }
}

async function run() {
  try {
    await ensureDir(OUTPUT_DIR);
    const files = await fs.promises.readdir(INPUT_DIR);
    const images = files.filter(f => !f.startsWith('optimized'));
    console.log(`Found ${images.length} files in ${INPUT_DIR}`);

    for (const file of images) {
      console.log('Processing', file);
      await processFile(file);
    }

    console.log('Image optimization complete. Optimized images are in public/images/optimized/');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
