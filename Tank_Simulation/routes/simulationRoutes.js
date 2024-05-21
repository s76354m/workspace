const express = require('express');
const router = express.Router();
const { startSimulation, getSimulationResults } = require('../controllers/simulationController');
const { validateSimulationRequest } = require('../routes/middleware/validationMiddleware');

// Apply validation middleware to the /start route
router.post('/start', validateSimulationRequest, startSimulation);
router.get('/results/:simulationId', getSimulationResults);

module.exports = router;