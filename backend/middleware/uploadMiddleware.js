import multer from 'multer';

const checkFileTypes = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp|gif/;
  const extname = filetypes.test(
    file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'))
  );
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Images only! (JPG, JPEG, PNG, WEBP, GIF)'));
};

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    checkFileTypes(file, cb);
  },
});
