const express = require('express');
const bcrypt = require('bcryptjs'); // ✅ bcryptjs
const jwt = require('jsonwebtoken');
const db = require('../db'); // ✅ make sure this exports a MySQL pool or connection

const router = express.Router();

// 🔐 Register Route
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });

    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(409).json({ error: 'Email already registered.' });

    const hashed = await bcrypt.hash(password, 10);
    await db.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashed]);

    return res.status(201).json({ message: 'Registration successful.' });
  } catch (err) {
    console.error('❌ Register Error:', err.message);
    return res.status(500).json({ error: 'Registration failed.' });
  }
});

// 🔐 Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });

    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(401).json({ error: 'Invalid email or password.' });

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password.' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );

    return res.json({ token });
  } catch (err) {
    console.error('❌ Login Error:', err.message);
    return res.status(500).json({ error: 'Login failed.' });
  }
});

module.exports = router;
