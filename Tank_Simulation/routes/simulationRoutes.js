const express = require('express');
const router = express.Router();
const { simulateBattle } = require('../utils/simulationEngine');

// POST /api/start-simulation - Start the simulation
router.post('/api/start-simulation', async (req, res) => {
  const { mapId, alliesTanks, axisTanks } = req.body;

  try {
    // Perform the battle simulation
    console.log('Starting simulation with data:', { mapId, alliesTanks, axisTanks });
    const simulationOutcome = await simulateBattle(mapId, alliesTanks, axisTanks);

    res.status(200).json({ message: 'Simulation completed', outcome: simulationOutcome });
  } catch (error) {
    console.error('Error starting simulation:', error.message);
    console.error(error.stack);
    res.status(500).json({ message: 'Error starting simulation', error: error.message });
  }
});

module.exports = router;