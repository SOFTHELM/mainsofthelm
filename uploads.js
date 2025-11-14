const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const db = require('../db');
const storageUtil = require('../utils/storage');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

// Upload music track
router.post('/music', auth, upload.single('track'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const url = await storageUtil.uploadFile({ buffer: req.file.buffer, filename: req.file.originalname, mimetype: req.file.mimetype });
    const q = await db.query('INSERT INTO music (user_id, title, filename, url) VALUES ($1,$2,$3,$4) RETURNING id, url, title', [req.user.id, req.body.title || req.file.originalname, req.file.originalname, url]);
    res.json(q.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// List music tracks for user
router.get('/music', auth, async (req, res) => {
  const q = await db.query('SELECT id, title, url FROM music WHERE user_id=$1 ORDER BY uploaded_at DESC', [req.user.id]);
  res.json(q.rows);
});

module.exports = router;
