const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
  const filePath = path.join(__dirname, '..', 'public', 'users.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to load projects' });
    } else {
      try {
        const projects = JSON.parse(data);
        res.json(projects);
      } catch {
        res.status(500).json({ error: 'Invalid JSON format' });
      }
    }
  });
});

module.exports = router;
