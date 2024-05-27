const express = require('express');
const router = express.Router();
const Map = require('../models/Map');

// GET /api/maps - Fetch all maps
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all maps with terrains...');
    const maps = await Map.find({}).populate('terrains');
    if (!maps || maps.length === 0) {
      console.error('No maps found.');
      return res.status(404).json({ message: 'No maps found' });
    }
    console.log('Maps fetched successfully.');
    res.status(200).json(maps);
  } catch (error) {
    console.error(`Error fetching maps: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: 'Error fetching maps', error: error.message });
  }
});

module.exports = router;