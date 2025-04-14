const express = require('express');
const db = require('../db/database');
const router = express.Router();

router.get('/', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { project_id, title, description, status, due_date } = req.body;
  db.run('INSERT INTO tasks (project_id, title, description, status, due_date) VALUES (?, ?, ?, ?, ?)',
    [project_id, title, description, status, due_date],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    });
});

router.put('/:id', (req, res) => {
  const { title, description, status, due_date } = req.body;
  db.run('UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ? WHERE id = ?',
    [title, description, status, due_date, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    });
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM tasks WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
