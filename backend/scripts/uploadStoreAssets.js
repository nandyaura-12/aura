/**
 * One-time script: upload storefront jewellery + explore images to Cloudinary.
 * Usage: node scripts/uploadStoreAssets.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cloudinary from '../config/cloudinary.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendSrc = path.resolve(__dirname, '../../frontend/src');

const jewelleryDir = path.join(frontendSrc, 'assets', 'jewellery');
const imgDir = path.join(frontendSrc, 'img');

const exploreMap = {
  'c559d1bbd8e9ea7ac911cb236d14ef44da5c228a.png': 'aura/explore/rings',
  'e4b0eaf06279e1b86e5fa1867bdefb9d821d7650.png': 'aura/explore/necklaces',
  '1359503369d0dfac3d59f2d4283fa24a6f4172e3.png': 'aura/explore/bracelets',
  '50314b9527ec49f9d179871a256d9e1221b65189.png': 'aura/explore/earrings',
  '2bc7567c44083209b719afc674af12873cfd7e03.png': 'aura/explore/lifestyle',
  '6be5a13356f5987e2d7ff676f78a3692db5f8464.png': 'aura/explore/hoops',
  'd09007d5c9b7a1c9478c74c32123f4b5b29ea938.png': 'aura/explore/chains',
  'logo.png': 'aura/brand/logo',
};

async function uploadFile(filePath, publicId) {
  const result = await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    overwrite: true,
    resource_type: 'image',
  });
  console.log(`✓ ${publicId} → ${result.secure_url}`);
  return result.secure_url;
}

async function run() {
  if (!process.env.CLOUDINARY_API_SECRET) {
    console.error('Missing CLOUDINARY_API_SECRET in backend/.env');
    process.exit(1);
  }

  const urls = {};

  for (let i = 1; i <= 23; i++) {
    const name = `img${String(i).padStart(2, '0')}.png`;
    const filePath = path.join(jewelleryDir, name);
    if (!fs.existsSync(filePath)) {
      console.warn(`skip missing ${name}`);
      continue;
    }
    urls[name] = await uploadFile(filePath, `aura/jewellery/img${String(i).padStart(2, '0')}`);
  }

  for (const [file, publicId] of Object.entries(exploreMap)) {
    const filePath = path.join(imgDir, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`skip missing ${file}`);
      continue;
    }
    urls[file] = await uploadFile(filePath, publicId);
  }

  const outPath = path.join(__dirname, 'cloudinary-urls.json');
  fs.writeFileSync(outPath, JSON.stringify(urls, null, 2));
  console.log(`\nSaved URL map → ${outPath}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
