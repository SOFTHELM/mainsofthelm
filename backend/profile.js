// backend/routes/profile.js
// Mount at app.use('/api/profile', require('./routes/profile'));

const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../authMiddleware'); // expects req.user.id

// GET /api/profile/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userQ = await db.query('SELECT id, firstname, lastname, email, username FROM users WHERE id=$1', [userId]);
    const profileQ = await db.query('SELECT display_name, level, pfp_url, bio, last_seen FROM profiles WHERE user_id=$1', [userId]);
    const traitsQ = await db.query(
      `SELECT t.* FROM traits t
       JOIN user_avatar_traits uat ON uat.trait_id = t.id
       WHERE uat.user_id = $1`, [userId]
    );
    const achQ = await db.query(
      `SELECT a.*, ua.unlocked_at FROM achievements a
       JOIN user_achievements ua ON ua.achievement_id = a.id
       WHERE ua.user_id = $1`, [userId]
    );

    res.json({
      success: true,
      user: userQ.rows[0] || null,
      profile: profileQ.rows[0] || null,
      traits: traitsQ.rows,
      achievements: achQ.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// PATCH /api/profile  -> update display_name, pfp_url, bio
router.patch('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { display_name, pfp_url, bio } = req.body;

    // Upsert into profiles
    await db.query(`
      INSERT INTO profiles (user_id, display_name, pfp_url, bio)
      VALUES ($1,$2,$3,$4)
      ON CONFLICT (user_id) DO UPDATE SET
        display_name = EXCLUDED.display_name,
        pfp_url = EXCLUDED.pfp_url,
        bio = EXCLUDED.bio
    `, [userId, display_name || null, pfp_url || null, bio || null]);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// POST /api/profile/avatar -> save selected trait ids (body: { traitIds: [1,2,3] })
router.post('/avatar', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { traitIds } = req.body;
    if (!Array.isArray(traitIds)) return res.status(400).json({ success: false, message: 'traitIds array required' });

    await db.query('BEGIN');
    await db.query('DELETE FROM user_avatar_traits WHERE user_id = $1', [userId]);
    const insertText = 'INSERT INTO user_avatar_traits (user_id, trait_id) VALUES ($1,$2)';
    for (const t of traitIds) {
      await db.query(insertText, [userId, t]);
    }
    await db.query('COMMIT');

    res.json({ success: true });
  } catch (err) {
    await db.query('ROLLBACK').catch(()=>{});
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// GET /api/traits -> list categories & traits
router.get('/traits', async (req, res) => {
  try {
    const cats = await db.query('SELECT * FROM trait_categories ORDER BY sort_order, id');
    const traits = await db.query('SELECT * FROM traits ORDER BY category_id, id');
    res.json({ success: true, categories: cats.rows, traits: traits.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
