// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const router = express.Router();

// router.get('/', (req, res) => {
//   const filePath = path.join(__dirname, '..', 'public', 'projects.json');
//   fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err) {
//       res.status(500).json({ error: 'Failed to load projects' });
//     } else {
//       try {
//         const projects = JSON.parse(data);
//         res.json(projects);
//       } catch {
//         res.status(500).json({ error: 'Invalid JSON format' });
//       }
//     }
//   });
// });

// module.exports = router;


//+++++++++++++++++++++++++++++++++++++++++++++++++++ Updated with POST

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '..', 'public', 'projects.json');

// GET all projects
router.get('/', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to load projects' });
    try {
      const projects = JSON.parse(data);
      res.json(projects);
    } catch {
      res.status(500).json({ error: 'Invalid JSON format' });
    }
  });
});

// POST a new project
router.post('/', (req, res) => {
  const newProject = req.body;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to load projects' });

    let projects = [];
    try {
      projects = JSON.parse(data);
    } catch {
      return res.status(500).json({ error: 'Invalid JSON format' });
    }

    newProject.id = Date.now(); // Simple unique ID
    projects.push(newProject);

    fs.writeFile(filePath, JSON.stringify(projects, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Failed to save project' });
      res.status(201).json(newProject);
    });
  });
});

// PUT (uppdate a property)

router.put('/:id', (req, res) => {
  const projectId = parseInt(req.params.id);
  const updatedData = req.body;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to load projects' });

    let projects;
    try {
      projects = JSON.parse(data);
    } catch {
      return res.status(500).json({ error: 'Invalid JSON format' });
    }

    const index = projects.findIndex(p => p.id === projectId);
    if (index === -1) return res.status(404).json({ error: 'Project not found' });

    projects[index] = { ...projects[index], ...updatedData };

    fs.writeFile(filePath, JSON.stringify(projects, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Failed to update project' });
      res.json(projects[index]);
    });
  });
});

//DELETE property
router.delete('/:id', (req, res) => {
  const projectId = parseInt(req.params.id);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to load projects' });

    let projects;
    try {
      projects = JSON.parse(data);
    } catch {
      return res.status(500).json({ error: 'Invalid JSON format' });
    }

    const filtered = projects.filter(p => p.id !== projectId);
    if (filtered.length === projects.length) {
      return res.status(404).json({ error: 'Project not found' });
    }

    fs.writeFile(filePath, JSON.stringify(filtered, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Failed to delete project' });
      res.json({ message: 'Project deleted' });
    });
  });
});



module.exports = router;
