const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validator = require('validator');
const router = express.Router();

const sanitizeHtml = require('sanitize-html');
const JWT_SECRET = process.env.JWT_SECRET; // Replaced with env variable in production

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Sanitize username
  //username = sanitizeHtml(username, {
    //allowedTags: [], //to allow tags -> allowedTags: ['b', 'i', 'em', 'strong'..etc]
   // allowedAttributes: {}
 // });

  // Escape dangerous characters
  const safeUsername = validator.escape(username);
  console.log('Escaped username:', safeUsername);

  try {
  
  const existingUser = await User.findOne({ username: safeUsername });
if (existingUser) {
  return res.status(400).json({ message: 'User already exists' });
}

  
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username: safeUsername, password: hashed });
    await user.save();
    res.status(201).json({ message: "User regisered" });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;

