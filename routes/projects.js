const express = require('express');
const db = require('../db/database');
const router = express.Router();

router.get('/', (req, res) => {
  db.all('SELECT * FROM projects', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { user_id, title, description } = req.body;
  db.run('INSERT INTO projects (user_id, title, description) VALUES (?, ?, ?)',
    [user_id, title, description],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, title, description });
    });
});

router.put('/:id', (req, res) => {
  const { title, description } = req.body;
  db.run('UPDATE projects SET title = ?, description = ? WHERE id = ?',
    [title, description, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    });
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM projects WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
