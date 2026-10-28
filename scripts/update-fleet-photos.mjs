import fs from 'fs';
import path from 'path';

const hiresDir = path.resolve('public/images/fleet/hires');

// 1. Transparent background photos
const transparentReplacements = [
  {
    src: 'White Toyota Sedan on Transparent Background.png',
    dest: 'toyota-yaris.png',
  },
  {
    src: 'White Toyota Hybrid Hatchback Cutout.png',
    dest: 'toyota-aqua.png',
  },
  {
    src: 'White Toyota Hatchback Cutout.png',
    dest: 'toyota-vitz.png',
  },
  {
    src: 'White Compact Hatchback Studio Cutout.png',
    dest: 'suzuki-wagon-r.png',
  },
];

// 2. 10 colored car photos
const coloredCars = [
  {
    src: 'Glossy Black Honda civic 11th gen Studio showcase.png',
    dest: 'honda-civic-11th-black.png',
  },
  {
    src: 'Burgundy Honda vezel Studio Showcase.png',
    dest: 'honda-vezel-burgundy.png',
  },
  {
    src: 'Champagne Toyota Hiace grand cabin on Black.png',
    dest: 'hiace-grand-cabin-champagne.png',
  },
  {
    src: 'Graphite Hyundai sonata Studio Render.png',
    dest: 'hyundai-sonata-graphite.png',
  },
  {
    src: 'Midnight Blue Honda civic reborn Studio Shot.png',
    dest: 'honda-civic-reborn-blue.png',
  },
  {
    src: 'Glossy Black Hyundai elantra  glx Sedan.png',
    dest: 'hyundai-elantra-glx-black.png',
  },
  {
    src: 'Graphite SUV hyundai tucson new.png',
    dest: 'hyundai-tucson-new-graphite.png',
  },
  {
    src: 'Silver Toyota corolla grande on Black Background.png',
    dest: 'toyota-corolla-grande-silver.png',
  },
  {
    src: 'Sleek Gray Honda city Studio Portrait.png',
    dest: 'honda-city-gray.png',
  },
  {
    src: 'Glossy Black Toyota Land Cruiser 2019.png',
    dest: 'land-cruiser-2019-black.png',
  },
];

console.log('Copying transparent replacements...');
for (const item of transparentReplacements) {
  const srcPath = path.join(hiresDir, item.src);
  const destPath = path.join(hiresDir, item.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✓ Copied "${item.src}" -> "${item.dest}"`);
  } else {
    console.error(`✗ Source file not found: ${srcPath}`);
  }
}

console.log('\nCopying colored car photos...');
for (const item of coloredCars) {
  const srcPath = path.join(hiresDir, item.src);
  const destPath = path.join(hiresDir, item.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✓ Copied "${item.src}" -> "${item.dest}"`);
  } else {
    console.error(`✗ Source file not found: ${srcPath}`);
  }
}

console.log('\nAll fleet photos processed successfully.');
