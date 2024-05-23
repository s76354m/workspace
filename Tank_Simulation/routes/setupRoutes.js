const express = require('express');
const router = express.Router();
const Tank = require('../models/Tank');
const Map = require('../models/Map');
const Terrain = require('../models/Terrain');

// GET /setup - Serve the simulation setup page
router.get('/', async (req, res) => {
  try {
    const tanks = await Tank.find({});
    const maps = await Map.find({}).populate('terrains');

    // Ensure terrain data includes type and coordinates
    maps.forEach(map => {
      map.terrains.forEach(terrain => {
        if (!terrain.type || typeof terrain.coordinates === 'undefined') {
          console.error('Terrain data missing type or coordinates property');
        }
      });
    });

    res.render('setup', { tanks, maps });
  } catch (error) {
    console.error(`Error fetching setup data: ${error.message}`);
    console.error(error.stack);
    res.status(500).send('Error fetching setup data');
  }
});

module.exports = router;