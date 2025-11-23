const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./auth');
const taskRoutes = require('./tasks');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});
app.listen(PORT, () => {
  console.log(`🚀 TaskFlow API running on port ${PORT}`);
});

module.exports = app;
