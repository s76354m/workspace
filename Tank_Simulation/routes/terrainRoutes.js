const express = require('express');
const router = express.Router();
const Terrain = require('../models/Terrain');

// GET /api/terrains - Fetch all terrains
router.get('/', async (req, res) => {
  try {
    const terrains = await Terrain.find({});
    res.status(200).json(terrains);
  } catch (error) {
    console.error(`Error fetching terrains: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: 'Error fetching terrains', error: error.message });
  }
});

module.exports = router;