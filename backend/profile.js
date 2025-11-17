const express = require('express');
const router = express.Router();
const db = require('./db');
const auth = require('./authMiddleware');

// ===== Get Profile =====
router.get('/', auth, async (req, res) => {
  const id = req.user.id;

  try {
    const user = await db.query(
      "SELECT firstname, lastname, email, username FROM users WHERE id = $1",
      [id]
    );

    res.json(user.rows[0]);

  } catch (err) {
    res.status(500).json({ error: "Error fetching profile" });
  }
});

module.exports = router;
