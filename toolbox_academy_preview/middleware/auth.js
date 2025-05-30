// middleware/auth.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // ✅ Using bcryptjs
const db = require('../db');

const secret = process.env.JWT_SECRET || 'default_secret_key'; // fallback for dev

// ✅ Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalid' });
    }

    req.user = user;
    next();
  });
}

// ✅ Hash user password using bcryptjs
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    throw new Error('Password hashing failed');
  }
}

// ✅ Compare plain and hashed passwords
async function comparePassword(plain, hashed) {
  try {
    return await bcrypt.compare(plain, hashed);
  } catch (err) {
    throw new Error('Password comparison failed');
  }
}

// ✅ Lookup user by email
async function findUserByEmail(email) {
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  } catch (err) {
    throw new Error('User lookup failed');
  }
}

module.exports = {
  authenticateToken,
  hashPassword,
  comparePassword,
  findUserByEmail
};
