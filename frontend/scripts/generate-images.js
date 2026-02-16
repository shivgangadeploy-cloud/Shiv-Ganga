import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Scans frontend/src/assets and generates -400, -800, -1200 webp variants for each .webp file
const ASSETS_DIR = path.join(process.cwd(), 'src', 'assets');
const widths = [400, 800, 1200];

async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext !== '.webp' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') return;

  const input = path.join(ASSETS_DIR, file);
  const base = path.join(ASSETS_DIR, path.basename(file, ext));

  for (const w of widths) {
    const out = `${base}-${w}.webp`;
    try {
      await sharp(input).resize({ width: w }).webp({ quality: 80 }).toFile(out);
      console.log(`Created ${out}`);
    } catch (e) {
      console.error(`Failed ${file} -> ${out}:`, e.message);
    }
  }
}

(async function main() {
  try {
    const files = fs.readdirSync(ASSETS_DIR);
    for (const f of files) {
      await processFile(f);
    }
    console.log('Image generation complete.');
  } catch (e) {
    console.error('Error scanning assets directory:', e.message);
    process.exit(1);
  }
})();
