require('dotenv').config();
const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Static uploads (local fallback)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./auth'));
app.use('/api/profile', require('./profile'));
app.use('/api/positions', require('./positions'));
app.use('/api', require('./uploads')); // for music

// Optional SPA fallback if you serve front-end from backend
// app.use(express.static(path.join(__dirname, 'public')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
