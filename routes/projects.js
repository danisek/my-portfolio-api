const auth = require('../middleware/auth');
const express = require('express');
const Project = require('../models/Project');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// GET all projects
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.userId });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
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
