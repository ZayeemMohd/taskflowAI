const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateUser } = require('./utils');

const router = express.Router();

// In-memory user storage (use database in production)
const users = [];

/**
 * Register a new user
 * Hashes password and stores user credentials
 */
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    const validation = validateUser(username, password);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    
    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
      createdAt: new Date()
    };
    
    users.push(newUser);
    
    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: newUser.id 
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * Login user
 * Validates credentials and returns JWT token
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );
    
    res.json({ 
      message: 'Login successful', 
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
