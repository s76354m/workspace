import express from 'express';
import { simulateBattle } from '../utils/simulationEngine.js';

const router = express.Router();

// POST /api/start-simulation - Start the simulation
router.post('/api/start-simulation', async (req, res) => {
  const { mapId, alliesTanks, axisTanks } = req.body;

  try {
    // Validate mapId
    if (!mapId) {
      return res.status(400).json({ message: 'Map ID is required' });
    }

    // Validate tank positions
    if (!Array.isArray(alliesTanks) || !Array.isArray(axisTanks)) {
      return res.status(400).json({ message: 'Invalid tank data format' });
    }

    const validateTanks = (tanks) => {
      return tanks.every(tank => 
        tank.tankId && typeof tank.tankId === 'string' &&
        tank.x !== undefined && typeof tank.x === 'number' &&
        tank.y !== undefined && typeof tank.y === 'number'
      );
    };

    if (!validateTanks(alliesTanks) || !validateTanks(axisTanks)) {
      return res.status(400).json({ message: 'Invalid tank position data' });
    }

    // Perform the battle simulation
    console.log('Starting simulation with data:', { mapId, alliesTanks, axisTanks });
    const simulationOutcome = await simulateBattle(mapId, alliesTanks, axisTanks);

    // Store the simulation outcome in the session
    req.session.simulationOutcome = simulationOutcome;

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

export default router;