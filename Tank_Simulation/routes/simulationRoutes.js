const express = require('express');
const router = express.Router();
const { startSimulation, getSimulationResults } = require('../controllers/simulationController');

router.post('/start', startSimulation);
router.get('/results/:simulationId', getSimulationResults); // Restore the dynamic parameter

module.exports = router;