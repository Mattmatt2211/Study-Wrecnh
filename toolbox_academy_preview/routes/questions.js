const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// POST /api/questions — Submit a question
router.post('/', authenticateToken, async (req, res) => {
  const { topic, question } = req.body;

  if (!topic || !question) {
    return res.status(400).json({ error: 'Both topic and question are required.' });
  }

  try {
    await db.execute(
      'INSERT INTO questions (user_id, topic, question) VALUES (?, ?, ?)',
      [req.user.id, topic || null, question || null]
    );
    res.json({ message: 'Question submitted successfully!' });
  } catch (err) {
    console.error('Insert Error:', err.message);
    res.status(500).json({ error: 'Failed to submit question.' });
  }
});

// GET /api/questions/mine — Get only your questions
router.get('/mine', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM questions WHERE user_id = ? ORDER BY id DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Mine Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch your questions.' });
  }
});

// GET /api/questions/all — Get all questions
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM questions ORDER BY id DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('All Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch questions.' });
  }
});

// GET /api/questions/others — Get others' questions
router.get('/others', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM questions WHERE user_id != ? ORDER BY id DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Others Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch others\' questions.' });
  }
});

module.exports = router;
