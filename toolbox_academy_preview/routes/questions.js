const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifyToken = require('../middleware/auth');

// 📌 Create a new question (Protected Route)
router.post('/', verifyToken, async (req, res) => {
  const { topic, question } = req.body;
  const userId = req.user?.id;

  if (!topic || !question || !userId) {
    return res.status(400).json({ error: 'Missing topic, question, or user.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO questions (user_id, topic, question) VALUES (?, ?, ?)',
      [userId, topic, question]
    );
    res.status(201).json({ message: 'Question submitted successfully' });
  } catch (err) {
    console.error('❌ DB Insert Error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// 📌 Get questions submitted by this user
router.get('/mine', verifyToken, async (req, res) => {
  const userId = req.user?.id;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM questions WHERE user_id = ? ORDER BY id DESC',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ Fetch Mine Error:', err.message);
    res.status(500).json({ error: 'Could not fetch your questions' });
  }
});

// 📌 Get all questions (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT q.id, q.topic, q.question, q.created_at, u.email FROM questions q JOIN users u ON q.user_id = u.id ORDER BY q.id DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ Fetch All Error:', err.message);
    res.status(500).json({ error: 'Could not fetch questions' });
  }
});

module.exports = router;

