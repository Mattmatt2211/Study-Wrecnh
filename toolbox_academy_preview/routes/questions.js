const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// ✅ Create a new question (user must be logged in)
router.post('/', auth, async (req, res) => {
  const { topic, question } = req.body;
  const userId = req.user?.id; // 🔐 Securely extracted from token

  if (!topic || !question || !userId) {
    return res.status(400).json({ error: 'Missing topic, question, or user' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO questions (topic, question, user_id) VALUES (?, ?, ?)',
      [topic, question, userId]
    );
    res.json({ success: true, question_id: result.insertId });
  } catch (err) {
    console.error('❌ Error inserting question:', err.message);
    res.status(500).json({ error: 'Database insert failed' });
  }
});

// ✅ Get all questions for the logged-in user
router.get('/mine', auth, async (req, res) => {
  try {
    const [questions] = await db.execute(
      'SELECT * FROM questions WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(questions);
  } catch (err) {
    console.error('❌ Error loading user questions:', err.message);
    res.status(500).json({ error: 'Failed to load questions' });
  }
});

// ✅ (Optional) Get all questions from all users
router.get('/all', async (req, res) => {
  try {
    const [questions] = await db.execute(
      'SELECT * FROM questions ORDER BY created_at DESC'
    );
    res.json(questions);
  } catch (err) {
    console.error('❌ Error loading all questions:', err.message);
    res.status(500).json({ error: 'Failed to load questions' });
  }
});

module.exports = router;


