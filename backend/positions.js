const express = require('express');
const router = express.Router();
const db = require('./db');
const auth = require('./authMiddleware');

// ===== Get All Positions =====
router.get('/', auth, async (req, res) => {
  try {
    const data = await db.query("SELECT * FROM positions");
    res.json(data.rows);

  } catch (err) {
    res.status(500).json({ message: "Error loading positions" });
  }
});

module.exports = router;
