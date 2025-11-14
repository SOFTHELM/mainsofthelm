const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const db = require('../db');
const multer = require('multer');
const storageUtil = require('../utils/storage');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

// Get current user profile
router.get('/me', auth, async (req, res) => {
  const q = await db.query('SELECT id, username, real_name, email, avatar_url, created_at FROM users WHERE id=$1', [req.user.id]);
  if (!q.rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(q.rows[0]);
});

// Upload avatar
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const url = await storageUtil.uploadFile({ buffer: req.file.buffer, filename: req.file.originalname, mimetype: req.file.mimetype });
    await db.query('UPDATE users SET avatar_url=$1 WHERE id=$2', [url, req.user.id]);
    res.json({ avatar_url: url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
