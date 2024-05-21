const express = require('express');
const router = express.Router();
const { startSimulation } = require('../controllers/simulationController');

router.post('/start', startSimulation);

module.exports = router;