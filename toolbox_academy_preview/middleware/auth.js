// middleware/auth.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // ✅ Use bcryptjs for compatibility
const db = require('../db');

const secret = process.env.JWT_SECRET || 'default_secret_key'; // fallback for dev

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token missing' });

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalid' });
    req.user = user;
    next();
  });
}

// Helper to hash passwords
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Helper to compare passwords
async function comparePassword(plain, hashed) {
  return await bcrypt.compare(plain, hashed);
}

// Helper to find user by email
async function findUserByEmail(email) {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

module.exports = {
  authenticateToken,
  hashPassword,
  comparePassword,
  findUserByEmail
};


