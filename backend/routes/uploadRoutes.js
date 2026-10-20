import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { upload } from '../middleware/uploadMiddleware.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

const cloudinaryConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

const streamUpload = (fileBuffer, options = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'aura',
        resource_type: 'image',
        ...options,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });

// Local fallback (no Cloudinary keys): save under backend/uploads, served at /uploads/*
const saveLocally = async (file) => {
  await fs.promises.mkdir(uploadsDir, { recursive: true });
  const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
  const filename = `antique-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  await fs.promises.writeFile(path.join(uploadsDir, filename), file.buffer);
  return { url: `/uploads/${filename}`, public_id: filename };
};

const uploadOne = async (file) =>
  cloudinaryConfigured() ? streamUpload(file.buffer) : saveLocally(file);

// @desc    Upload single image (Cloudinary if configured, else local disk)
// @route   POST /api/upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const result = await uploadOne(req.file);
    const url = result.secure_url || result.url;

    res.json({
      message: 'Image uploaded successfully',
      url,
      public_id: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Upload multiple images (Cloudinary if configured, else local disk)
// @route   POST /api/upload/multiple
router.post('/multiple', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files uploaded' });
    }

    const results = await Promise.all(req.files.map((file) => uploadOne(file)));

    res.json({
      message: 'Images uploaded successfully',
      urls: results.map((r) => r.secure_url || r.url),
      public_ids: results.map((r) => r.public_id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
