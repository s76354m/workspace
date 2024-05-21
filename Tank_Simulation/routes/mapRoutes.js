const express = require('express');
const router = express.Router();
const Map = require('../models/Map');

// GET /api/maps - Fetch all maps
router.get('/', async (req, res) => {
  try {
    const maps = await Map.find({}).populate('terrains');
    res.status(200).json(maps);
  } catch (error) {
    console.error(`Error fetching maps: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: 'Error fetching maps', error: error.message });
  }
});

// GET /api/maps/:id - Fetch a single map by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const map = await Map.findById(id).populate('terrains');
    if (!map) {
      return res.status(404).json({ message: 'Map not found' });
    }
    res.status(200).json(map);
  } catch (error) {
    console.error(`Error fetching map: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;