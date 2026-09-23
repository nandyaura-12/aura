import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// @desc    Upload single image
// @route   POST /api/upload
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      message: 'Image uploaded successfully',
      url: imageUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
router.post('/multiple', upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files uploaded' });
    }
    const urls = req.files.map((file) => `/uploads/${file.filename}`);
    res.json({
      message: 'Images uploaded successfully',
      urls,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
