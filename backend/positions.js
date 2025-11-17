const express = require('express');
const router = express.Router();
const auth = require('./authMiddleware');
const db = require('./db');

// Save/update position
router.post('/', auth, async (req, res) => {
  const { box_id, x, y } = req.body;
  if (!box_id || typeof x !== 'number' || typeof y !== 'number')
    return res.status(400).json({ error: 'invalid' });

  try {
    await db.query(
      `INSERT INTO positions (user_id, box_id, x, y) VALUES ($1,$2,$3,$4)
       ON CONFLICT (user_id, box_id) DO UPDATE SET x=EXCLUDED.x, y=EXCLUDED.y, updated_at=now()`,
      [req.user.id, box_id, x, y]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all positions for user
router.get('/', auth, async (req, res) => {
  try {
    const q = await db.query('SELECT box_id, x, y FROM positions WHERE user_id=$1', [req.user.id]);
    res.json(q.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
