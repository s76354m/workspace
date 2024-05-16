const Tank = require('../models/Tank');
const Map = require('../models/Map');
const { performBattle } = require('./battleCalculator');
const mongoose = require('mongoose');

async function validateInputData(tankIds, mapId, tankPositions, quantities) {
    if (!Array.isArray(tankIds) || !tankIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
        throw new Error('Invalid tank IDs: Each ID must be a valid MongoDB ObjectId.');
    }
    if (typeof mapId !== 'string' || !mongoose.Types.ObjectId.isValid(mapId)) {
        throw new Error('Invalid map ID: Must be a valid MongoDB ObjectId.');
    }
    if (!Array.isArray(tankPositions) || tankPositions.length === 0 || !tankPositions.every(pos => typeof pos === 'object' && pos.hasOwnProperty('x') && pos.hasOwnProperty('y') && typeof pos.x === 'number' && typeof pos.y === 'number')) {
        throw new Error('Invalid tank positions: Must be a non-empty array of objects with x and y properties, both of which must be numbers.');
    }
    if (!Array.isArray(quantities) || !quantities.every(quantity => Number.isInteger(quantity) && quantity > 0)) {
        throw new Error('Invalid quantities: Each quantity must be a positive integer.');
    }
}

async function simulateBattle(tankIds, mapId, tankPositions, quantities) {
    try {
        await validateInputData(tankIds, mapId, tankPositions, quantities);

        // Fetch tanks based on tankIds and include quantities
        const tanks = await Tank.find({ '_id': { $in: tankIds.map(id => new mongoose.Types.ObjectId(id)) } });
        if (!tanks.length) throw new Error('No tanks found with the provided IDs');

        // Attach quantities to tanks
        const tanksWithQuantities = tanks.map(tank => {
            const index = tankIds.indexOf(tank._id.toString());
            const quantity = quantities[index];
            return { ...tank.toObject(), quantity: quantity ? parseInt(quantity, 10) : 0 };
        });

        // Fetch the selected map based on mapId
        const map = await Map.findById(mapId).populate('terrains');
        if (!map) throw new Error('No map found with the provided ID');

        // Simulation logic to determine movements, engagements, and outcomes
        const results = performBattle(tanksWithQuantities, map, tankPositions);

        // Ensure results are returned in an array format
        if (!Array.isArray(results)) {
            console.log('Converting simulation results from object to array format.');
            const arrayResults = Object.values(results).map(result => {
                if (!result.tankId) {
                    console.error('Simulation result missing tankId:', result);
                    return null;
                }
                return {
                    tankId: result.tankId.toString(),
                    position: result.position,
                    status: result.status
                };
            }).filter(result => result !== null);
            console.log('Simulation results:', arrayResults);
            return arrayResults;
        }

        console.log('Simulation results:', results);

        return results;
    } catch (error) {
        console.error(`Simulation error: ${error.message}`, error.stack);
        throw error; // Rethrow the error to be handled by the caller
    }
}

module.exports = { simulateBattle };