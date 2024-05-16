const express = require('express');
const router = express.Router();
const Tank = require('../models/Tank');
const { isAuthenticated } = require('./middleware/authMiddleware');

// Add new tank
router.post('/tanks', isAuthenticated, async (req, res) => {
  try {
    const tank = new Tank(req.body);
    await tank.save();
    console.log(`New tank added: ${tank.name}`);
    res.status(201).json(tank);
  } catch (error) {
    console.error(`Error adding new tank: ${error.message}`, error.stack);
    res.status(400).json({ error: error.message });
  }
});

// Update existing tank
router.put('/tanks/:id', isAuthenticated, async (req, res) => {
  try {
    const tank = await Tank.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tank) {
      console.log(`Tank with ID ${req.params.id} not found for update.`);
      return res.status(404).json({ error: 'Tank not found' });
    }
    console.log(`Tank updated: ${tank.name}`);
    res.json(tank);
  } catch (error) {
    console.error(`Error updating tank: ${error.message}`, error.stack);
    res.status(400).json({ error: error.message });
  }
});

// Delete tank
router.delete('/tanks/:id', isAuthenticated, async (req, res) => {
  try {
    const tank = await Tank.findByIdAndDelete(req.params.id);
    if (!tank) {
      console.log(`Tank with ID ${req.params.id} not found for deletion.`);
      return res.status(404).json({ error: 'Tank not found' });
    }
    console.log(`Tank deleted: ${tank.name}`);
    res.json({ message: 'Tank deleted successfully' });
  } catch (error) {
    console.error(`Error deleting tank: ${error.message}`, error.stack);
    res.status(400).json({ error: error.message });
  }
});

// Fetch the list of all tanks
router.get('/tanks', isAuthenticated, async (req, res) => {
  try {
    const tanks = await Tank.find({});
    console.log(`Fetched ${tanks.length} tanks.`);
    res.json(tanks);
  } catch (error) {
    console.error(`Error fetching tanks: ${error.message}`, error.stack);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;