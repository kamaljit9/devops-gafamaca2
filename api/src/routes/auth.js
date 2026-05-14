const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const db = require('../services/db');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Load keys
const privateKey = fs.readFileSync(path.resolve(process.env.JWT_PRIVATE_KEY_PATH), 'utf8');

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await db.query(
      'INSERT INTO users (id, email, password, name) VALUES ($1, $2, $3, $4)',
      [userId, email, hashedPassword, name]
    );

    res.status(201).json({ id: userId, email, name });
  } catch (err) {
    if (err.code === '23505') {
      err.status = 400;
      err.code = 'USER_ALREADY_EXISTS';
    }
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      privateKey,
      { algorithm: 'RS256', expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
