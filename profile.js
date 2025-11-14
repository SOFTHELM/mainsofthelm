const express = require('express');
const db = require('./db');
const auth = require('./authMiddleware');
const router = express.Router();

router.get('/profile', auth, async (req, res) => {
  try {
    const [profile] = await db.query('SELECT * FROM profiles WHERE user_id = ?', [req.user.id]);
    res.json(profile || {});
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
