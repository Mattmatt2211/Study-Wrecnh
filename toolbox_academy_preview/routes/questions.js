const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all questions
router.get('/', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM questions');
  res.json(rows);
});

// Submit a new question
router.post('/', async (req, res) => {
  const { question, topic, user_id } = req.body;
  try {
    await db.execute(
      'INSERT INTO questions (question, topic, user_id) VALUES (?, ?, ?)',
      [question, topic, user_id]
    );
    res.status(201).send('Question submitted');
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;