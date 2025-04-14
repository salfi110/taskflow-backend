const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const router = express.Router();

const SECRET = process.env.JWT_SECRET || 'secret_key';

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.run('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
    [username, email, hash],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, username, email });
    });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, username: user.username } });
  });
});

module.exports = router;
