const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to verify token
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token missing' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

// Post a question
router.post('/', authMiddleware, async (req, res) => {
  const { question, topic } = req.body;
  const user_id = req.user.id;

  try {
    await db.query('INSERT INTO questions (user_id, question, topic) VALUES (?, ?, ?)', [user_id, question, topic]);
    res.json({ message: 'Question submitted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error submitting question' });
  }
});

// Get all questions
router.get('/all', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM questions ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching questions' });
  }
});

// Get only logged-in user's questions
router.get('/mine', authMiddleware, async (req, res) => {
  const user_id = req.user.id;
  try {
    const [rows] = await db.query('SELECT * FROM questions WHERE user_id = ? ORDER BY id DESC', [user_id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching your questions' });
  }
});

// Get all other users’ questions
router.get('/others', authMiddleware, async (req, res) => {
  const user_id = req.user.id;
  try {
    const [rows] = await db.query('SELECT * FROM questions WHERE user_id != ? ORDER BY id DESC', [user_id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching other questions' });
  }
});

module.exports = router;
