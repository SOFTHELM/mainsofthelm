const express = require('express');
const cors = require('cors');
const authRoutes = require('./auth');
const profileRoutes = require('./profile');
const positionsRoutes = require('./positions');
const uploadsRoutes = require('./uploads');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/positions', positionsRoutes);
app.use('/api/uploads', uploadsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
