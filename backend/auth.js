const express = require('express');
const router = express.Router();
const db = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// ===== REGISTER =====
router.post('/register', async (req, res) => {
  const { firstname, lastname, email, username, password } = req.body;

  try {
    const exists = await db.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    if (exists.rows.length > 0)
      return res.json({ success: false, message: "Username already exists" });

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (firstname, lastname, email, username, password)
       VALUES ($1, $2, $3, $4, $5)`,
      [firstname, lastname, email, username, hash]
    );

    res.json({ success: true, message: "Account created" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

// ===== LOGIN =====
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (user.rows.length === 0)
      return res.json({ success: false, message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.rows[0].password);
    if (!valid)
      return res.json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
