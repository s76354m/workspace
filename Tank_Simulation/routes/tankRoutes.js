const express = require('express');
const router = express.Router();
const Tank = require('../models/Tank');
const { isAuthenticated } = require('./middleware/authMiddleware');

// GET /api/tanks - Fetch all tanks
router.get('/', async (req, res) => {
  try {
    const tanks = await Tank.find({});
    res.status(200).json(tanks);
  } catch (error) {
    console.error(`Error fetching tanks: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: 'Error fetching tanks' });
  }
});

// POST /api/tanks - Add a new tank
router.post('/', isAuthenticated, async (req, res) => {
  const { name, frontalArmor, sideArmor, mainGunSize, mainGunPenetration } = req.body;
  try {
    const newTank = new Tank({ name, frontalArmor, sideArmor, mainGunSize, mainGunPenetration });
    await newTank.save();
    res.status(201).json(newTank);
  } catch (error) {
    console.error(`Error adding tank: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: 'Error adding tank' });
  }
});

// PUT /api/tanks/:id - Update an existing tank
router.put('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { name, frontalArmor, sideArmor, mainGunSize, mainGunPenetration } = req.body;
  try {
    const updatedTank = await Tank.findByIdAndUpdate(
      id,
      { name, frontalArmor, sideArmor, mainGunSize, mainGunPenetration },
      { new: true, runValidators: true }
    );
    if (!updatedTank) {
      return res.status(404).json({ message: 'Tank not found' });
    }
    res.status(200).json(updatedTank);
  } catch (error) {
    console.error(`Error updating tank: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: 'Error updating tank' });
  }
});

// DELETE /api/tanks/:id - Delete a tank
router.delete('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTank = await Tank.findByIdAndDelete(id);
    if (!deletedTank) {
      return res.status(404).json({ message: 'Tank not found' });
    }
    res.status(200).json({ message: 'Tank deleted successfully' });
  } catch (error) {
    console.error(`Error deleting tank: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: 'Error deleting tank' });
  }
});

module.exports = router;