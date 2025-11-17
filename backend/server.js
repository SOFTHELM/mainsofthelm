require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// ===== Middleware =====
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// ===== Serve static front-end files =====
app.use(express.static(path.join(__dirname, '../public')));

// ===== Default route =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/comms.html'));
});

// ===== API routes =====
app.use('/api/auth', require('./auth'));
app.use('/api/profile', require('./profile'));
app.use('/api/positions', require('./positions'));
app.use('/api', require('./uploads'));

// ===== Start server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
