const express = require('express');
const router = express.Router();
const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Sign-up
router.post('/signup', async (req, res) => {
  try {
    const username = req.body.username?.trim();
    const password = req.body.password;
    const email = req.body.email?.trim();
    const realName = req.body.realName?.trim();

    if (!username || !password || !email)
      return res.status(400).json({ error: 'username, password, and email required' });

    const hashed = await bcrypt.hash(password, 12);

    const result = await db.query(
      'INSERT INTO users (username, real_name, email, password_hash) VALUES ($1,$2,$3,$4) RETURNING id, username, avatar_url',
      [username, realName || null, email, hashed]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({ token, user: { id: user.id, username: user.username, avatar: user.avatar_url } });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') return res.status(409).json({ error: 'username or email already exists' });
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const username = req.body.username?.trim();
    const password = req.body.password;

    const q = await db.query('SELECT id, username, password_hash FROM users WHERE username=$1', [username]);
    if (!q.rows.length) return res.status(401).json({ error: 'Invalid credentials' });

    const user = q.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
