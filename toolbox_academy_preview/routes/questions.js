const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// 🔐 POST /api/questions — Submit a question
router.post('/', authenticateToken, async (req, res) => {
  let { topic, question } = req.body;
  const userId = req.user?.id;

  console.log("📥 Submitting Question:");
  console.log("🧠 User ID:", userId);
  console.log("📚 Topic:", topic);
  console.log("💬 Question:", question);

  if (!userId || !topic || !question) {
    return res.status(400).json({ error: 'Missing topic, question, or user.' });
  }

  try {
    await db.execute(
      'INSERT INTO questions (user_id, topic, question) VALUES (?, ?, ?)',
      [userId, topic, question]
    );
    res.json({ message: 'Question submitted successfully!' });
  } catch (err) {
    console.error("❌ DB ERROR:", err.message);
    res.status(500).json({ error: 'Failed to submit question.' });
  }
});

// 🔐 GET /api/questions/mine — Get logged-in user's questions
router.get('/mine', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM questions WHERE user_id = ? ORDER BY id DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ Mine Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch your questions.' });
  }
});

// 🔐 GET /api/questions/all — Get all questions
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM questions ORDER BY id DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ All Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch questions.' });
  }
});

// 🔐 GET /api/questions/others — Get other users’ questions
router.get('/others', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM questions WHERE user_id != ? ORDER BY id DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ Others Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch others\' questions.' });
  }
});

module.exports = router;

