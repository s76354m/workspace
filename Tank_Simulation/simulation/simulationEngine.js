const Tank = require('../models/Tank');
const Map = require('../models/Map');
const { performBattle } = require('./battleCalculator');
const mongoose = require('mongoose');

async function simulateBattle(tankIds, mapId, tankPositions, quantities) {
    try {
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

        // Validate tank positions
        if (!Array.isArray(tankPositions) || tankPositions.length === 0) {
            throw new Error('Invalid tank positions provided.');
        }

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