const express = require('express');
const router = express.Router();
const { simulateBattle } = require('../utils/simulationEngine');

// Function to validate tank positions
const validateTankPositions = (tanks) => {
  return tanks.every(tank => 
    Number.isInteger(tank.x) && tank.x >= 0 &&
    Number.isInteger(tank.y) && tank.y >= 0
  );
};

// POST /api/start-simulation - Start the simulation
router.post('/api/start-simulation', async (req, res) => {
  const { mapId, alliesTanks, axisTanks } = req.body;

  try {
    // Validate input data
    if (!mapId || !Array.isArray(alliesTanks) || !Array.isArray(axisTanks)) {
      return res.status(400).json({ message: 'Invalid input data' });
    }


    // Ensure tank positions are correctly formatted
    const formatTankPositions = (tanks) => {
      return tanks.map(tank => ({
        ...tank,
        x: parseInt(tank.x, 10),
        y: parseInt(tank.y, 10)
      }));
    };

    const formattedAlliesTanks = formatTankPositions(alliesTanks);
    const formattedAxisTanks = formatTankPositions(axisTanks);

    // Validate tank positions
    if (!validateTankPositions(formattedAlliesTanks) || !validateTankPositions(formattedAxisTanks)) {
      return res.status(400).json({ message: 'Invalid tank positions' });
    }

    // Log the received data for debugging
    console.log('Received simulation data:', { mapId, alliesTanks: formattedAlliesTanks, axisTanks: formattedAxisTanks });


    // Perform the battle simulation
    console.log('Starting simulation with data:', { mapId, alliesTanks: formattedAlliesTanks, axisTanks: formattedAxisTanks });
    const simulationOutcome = await simulateBattle(mapId, formattedAlliesTanks, formattedAxisTanks);

    // Log the simulation outcome before storing it in the session
    console.log('Simulation outcome:', simulationOutcome);

    // Store the simulation outcome in the session
    req.session.simulationOutcome = simulationOutcome;

    // Log the stored simulation outcome
    console.log('Stored simulation outcome in session:', simulationOutcome);

    res.status(200).json({ message: 'Simulation completed', outcome: simulationOutcome });
  } catch (error) {
    console.error('Error starting simulation:', error.message);
    console.error(error.stack);
    res.status(500).json({ message: 'Error starting simulation', error: error.message });
  }
});

// GET /simulation-results - Display the simulation results
router.get('/simulation-results', (req, res) => {
  const simulationOutcome = req.session.simulationOutcome;
  if (!simulationOutcome) {
    return res.status(404).send('No simulation results found.');
  }

  res.render('simulationResults', { outcome: simulationOutcome });
});

// GET /api/simulation-outcome - Fetch the simulation outcome
router.get('/api/simulation-outcome', (req, res) => {
  if (req.session.simulationOutcome) {
    res.json({ outcome: req.session.simulationOutcome });
  } else {
    res.status(404).json({ error: 'No simulation outcome found' });
  }
});

module.exports = router;