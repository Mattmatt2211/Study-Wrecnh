onst express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve index.html and other static files from the root directory
app.use(express.static(__dirname));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);

// Fallback: serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
