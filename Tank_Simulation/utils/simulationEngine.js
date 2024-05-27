const Tank = require('../models/Tank');
const Map = require('../models/Map');

const simulateBattle = async (mapId, alliesTanks, axisTanks) => {
  try {
    console.log('Fetching map and terrains...');
    // Fetch map and terrains
    const map = await Map.findById(mapId).populate('terrains');
    if (!map) {
      throw new Error('Map not found');
    }
    console.log('Map and terrains fetched successfully.');

    console.log('Fetching tank details...');
    // Fetch tank details
    const allTankIds = [...alliesTanks.map(t => t.tankId), ...axisTanks.map(t => t.tankId)];
    const tanks = await Tank.find({ _id: { $in: allTankIds } });

    // Map tank details to their ids for quick lookup
    const tankDetails = tanks.reduce((acc, tank) => {
      acc[tank._id] = tank;
      return acc;
    }, {});
    console.log('Tank details fetched successfully.');

    console.log('Simulating engagements...');
    // Placeholder logic for battle simulation
    const outcomes = simulateEngagements(map, alliesTanks, axisTanks, tankDetails);
    console.log('Engagements simulated successfully.');

    return outcomes;
  } catch (error) {
    console.error('Error in simulateBattle at:', { mapId, alliesTanks, axisTanks });
    console.error('Error details:', error.message);
    console.error(error.stack);
    throw error;
  }
};

const getTerrainEffects = (map, tank) => {
  if (!tank || typeof tank.x === 'undefined' || typeof tank.y === 'undefined') {
    console.error('Invalid tank object:', tank);
    return { movementEffect: 1, combatEffect: 1 }; // Default to no effect if tank is invalid
  }
  if (!map || !map.terrains) {
    console.error('Invalid map object:', map);
    return { movementEffect: 1, combatEffect: 1 }; // Default to no effect if map is invalid
  }

  const terrain = map.terrains.find(t => t.coordinates[0] === tank.x && t.coordinates[1] === tank.y);
  if (terrain) {
    return { movementEffect: terrain.movementEffect, combatEffect: terrain.combatEffect };
  }
  return { movementEffect: 1, combatEffect: 1 }; // Default to no effect if no terrain found
};

const calculateAdjustedAttributes = (tank, tankDetails, map) => {
  const tankInfo = tankDetails[tank.tankId];
  if (!tankInfo) {
    console.error('Tank details not found for tankId:', tank.tankId);
    return { ...tank, outcome: 'unknown', adjustedMovement: 0, adjustedCombat: 0, x: tank.x, y: tank.y };
  }

  const terrainEffects = getTerrainEffects(map, tank);

  const adjustedMovement = tankInfo.movement * terrainEffects.movementEffect;
  const adjustedCombat = tankInfo.combat * terrainEffects.combatEffect;

  return {
    ...tank,
    outcome: 'survived',
    adjustedMovement,
    adjustedCombat,
    x: tank.x,
    y: tank.y
  };
};

const simulateEngagements = (map, alliesTanks, axisTanks, tankDetails) => {
  // Placeholder for battle logic
  const outcomes = {
    shotsFired: 0,
    allies: {
      tanks: [],
      damageDealt: 0,
      tanksDestroyed: 0,
    },
    axis: {
      tanks: [],
      damageDealt: 0,
      tanksDestroyed: 0,
    },
  };

  // Simulate each tank's action
  alliesTanks.forEach(tank => {
    const tankInfo = tankDetails[tank.tankId];
    // Add placeholder outcome
    outcomes.allies.tanks.push({ ...tank, outcome: 'survived' });
  });

  axisTanks.forEach(tank => {
    const tankInfo = tankDetails[tank.tankId];
    // Add placeholder outcome
    outcomes.axis.tanks.push({ ...tank, outcome: 'destroyed' });
  });

  // Update placeholder statistics
  outcomes.shotsFired = alliesTanks.length + axisTanks.length;
  outcomes.allies.damageDealt = alliesTanks.length * 10;
  outcomes.allies.tanksDestroyed = 0;
  outcomes.axis.damageDealt = axisTanks.length * 10;
  outcomes.axis.tanksDestroyed = axisTanks.length;

  return outcomes;
};

module.exports = {
  simulateBattle,
};