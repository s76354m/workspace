const express = require('express');
const router = express.Router();
const Tank = require('../models/Tank');
const Map = require('../models/Map');
const { simulateBattle } = require('../simulation/simulationEngine');
const { convertResultsToArray } = require('../utils/simulationUtils.js');

// Middleware to check for authenticated users
const { isAuthenticated } = require('./middleware/authMiddleware');

// Middleware to validate simulation outcome format
const validateSimulationOutcome = (req, res, next) => {
    if (typeof req.session.results !== 'undefined' && !Array.isArray(req.session.results)) {
        console.log('Adjusting simulation results format to include an outcomes property.');
        const adjustedResults = { outcomes: req.session.results };
        req.session.results = adjustedResults;
    } else if (typeof req.session.results === 'undefined') {
        console.error('Simulation results not found in session');
        next(new Error('Simulation results not found.'));
    } else {
        next();
    }
};

router.get('/setup', isAuthenticated, async (req, res) => {
    try {
        const tanks = await Tank.find({});
        const maps = await Map.find({}).populate('terrains');
        res.render('simulationSetup', { tanks, maps });
    } catch (error) {
        console.error(`Error fetching tanks or maps: ${error.message}`, error.stack);
        res.status(500).send("Failed to load simulation setup page.");
    }
});

router.post('/start', isAuthenticated, async (req, res, next) => {
    const { tanks, mapId, tankPositions } = req.body;
    try {
        // Validate tanks input
        if (!Array.isArray(tanks) || tanks.length === 0) {
            throw new Error('No tanks provided for the simulation.');
        }
        // Filter out invalid tanks data
        const validTanks = tanks.filter(tank => tank.id && tank.quantity > 0);
        if (validTanks.length === 0) {
            return res.status(400).send('Invalid tank data provided.');
        }
        const tankIds = validTanks.map(tank => tank.id);
        const quantities = validTanks.map(tank => tank.quantity);

        // Validate tankPositions input
        if (!Array.isArray(tankPositions) || tankPositions.length === 0 || !tankPositions.every(pos => 'x' in pos && 'y' in pos && typeof pos.x === 'number' && typeof pos.y === 'number')) {
            console.error('Invalid tank positions: Each position must include x and y coordinates as numbers.');
            return res.status(400).send('Invalid tank positions provided.');
        }

        const results = await simulateBattle(tankIds, mapId, tankPositions, quantities);
        // Assuming results are stored in session for retrieval in the results route
        // Check if results are in object format and convert to array if necessary
        req.session.results = convertResultsToArray(results);
        next();
    } catch (error) {
        console.error(`Simulation error: ${error.message}`, error.stack);
        res.status(500).send("Failed to simulate the battle.");
    }
}, validateSimulationOutcome, (req, res) => {
    // Send the adjusted results after validation and adjustment
    res.json({ message: "Battle simulation results", outcomes: req.session.results });
});

router.get('/results', isAuthenticated, async (req, res) => {
    try {
        // Assuming results are passed via session or a temporary store since permanent storage is not mentioned
        const results = req.session.results; // Retrieve results from session
        if (!results) {
            throw new Error('No results found. Please run a simulation first.');
        }
        res.render('simulationResults', { results });
    } catch (error) {
        console.error(`Error fetching simulation results: ${error.message}`, error.stack);
        res.status(500).send("Failed to load results page.");
    }
});

router.get('/api/maps/:id', isAuthenticated, async (req, res) => {
    try {
        const mapId = req.params.id;
        const map = await Map.findById(mapId).populate({
            path: 'terrains',
            model: 'Terrain',
            select: 'type movementPenalty combatEffect -_id'
        });
        if (!map) {
            return res.status(404).send('Map not found');
        }
        const mapData = {
            name: map.name,
            terrains: map.terrains.map(terrain => ({
                type: terrain.type,
                movementPenalty: terrain.movementPenalty,
                combatEffect: terrain.combatEffect
            })),
            terrainLayouts: map.terrainLayouts
        };
        res.json(mapData);
    } catch (error) {
        console.error(`Error fetching map: ${error.message}`, error.stack);
        res.status(500).send("Failed to fetch map data.");
    }
});

module.exports = router;