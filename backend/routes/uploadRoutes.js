import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

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

// @desc    Upload single image to Cloudinary
// @route   POST /api/upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    if (!process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({
        message: 'Cloudinary is not configured. Set CLOUDINARY_API_SECRET in backend/.env',
      });
    }

    const result = await streamUpload(req.file.buffer);

    res.json({
      message: 'Image uploaded successfully',
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Upload multiple images to Cloudinary
// @route   POST /api/upload/multiple
router.post('/multiple', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files uploaded' });
    }

    if (!process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({
        message: 'Cloudinary is not configured. Set CLOUDINARY_API_SECRET in backend/.env',
      });
    }

    const results = await Promise.all(
      req.files.map((file) => streamUpload(file.buffer))
    );

    res.json({
      message: 'Images uploaded successfully',
      urls: results.map((r) => r.secure_url),
      public_ids: results.map((r) => r.public_id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
