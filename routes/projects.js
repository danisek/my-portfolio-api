const auth = require('../middleware/auth');
const authenticateToken = require('../middleware/authMiddleware');
const express = require('express');
const Project = require('../models/Project');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// GET all projects
router.get('/', auth, authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.userId });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});


router.get('/projects', authenticateToken, (req, res) => {
  res.json({
    message: 'Access granted to protected projects route',
    userId: req.user.userId
  });
});





// POST a new project
router.post(
  '/', auth,
  [
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('description').optional().isString(),
    body('tags').isArray().withMessage('Tags must be an array')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newProject = new Project({
        ...req.body,
        userId: req.user.userId  // 👈 This links the project to the logged-in user
      });
      const saved = await newProject.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: 'Failed to save project' });
    }
  }
);





// TEMPORARY: Seed route
router.post('/seed', async (req, res) => {
  try {
    const sampleProjects = [
      {
        title: 'AI Portfolio Website',
        description: 'A personal site built with React and Node.js',
        tags: ['React', 'Node', 'Portfolio'],
        userId: '68fd321abc57c331311d54b5' //alice
      },
      {
        title: 'Weather App',
        description: 'A simple weather app using OpenWeatherMap API',
        tags: ['JavaScript', 'API'],
        userId: '68fd5b294c667b1a2c782218' //lukmuhn
      }
    ];

    const inserted = await Project.insertMany(sampleProjects);
    res.json({ message: 'Seeded successfully', data: inserted });
  } catch (err) {
    res.status(500).json({ error: 'Seeding failed', details: err.message });
  }
});








// PUT update project
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Project not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE project
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;
