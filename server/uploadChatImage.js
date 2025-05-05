import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

// ES module __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/chat');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    console.error('No file uploaded');
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const filePath = path.join(uploadDir, req.file.filename);
  const url = `/uploads/chat/${req.file.filename}`;
  // Log file path and URL
  console.log('Image uploaded:', filePath);
  console.log('Image URL:', url);
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error('File not found after upload:', filePath);
    return res.status(500).json({ error: 'File not saved on server' });
  }
  res.json({ url });
});

export default router;
