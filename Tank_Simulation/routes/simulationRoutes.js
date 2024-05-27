const express = require('express');
const router = express.Router();
const Tank = require('../models/Tank');
const Map = require('../models/Map');

// GET /simulation-setup - Render the simulation setup page
router.get('/simulation-setup', async (req, res) => {
  try {
    // Fetch all tanks
    const tanks = await Tank.find({});
    console.log('Fetched tanks for simulation setup:', tanks);

    // Fetch all maps
    const maps = await Map.find({}).populate('terrains');
    console.log('Fetched maps for simulation setup:', maps);

    // Render the simulation setup page with tanks, maps, and session data
    res.render('simulationSetup', { tanks, maps, session: req.session });
  } catch (error) {
    console.error('Error fetching data for simulation setup:', error.message);
    console.error(error.stack);
    res.status(500).send('Error fetching data for simulation setup');
  }
});

module.exports = router;