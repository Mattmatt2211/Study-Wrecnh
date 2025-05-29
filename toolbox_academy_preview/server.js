const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Log every request for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve static files from the root directory
app.use(express.static(__dirname));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);

// ✅ Serve custom auth.html page
app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, 'auth.html'));
});

// Fallback: only for GET requests not starting with /api
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
