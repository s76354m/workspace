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

const getTerrainEffects = (map, position) => {
  const terrain = map.terrains.find(t => t.coordinates[0] === position.x && t.coordinates[1] === position.y);
  if (terrain) {
    return { movementEffect: terrain.movementEffect, combatEffect: terrain.combatEffect };
  }
  return { movementEffect: 1, combatEffect: 1 }; // Default to no effect if no terrain found
};

const calculateAdjustedAttributes = (tank, tankDetails, map) => {
  const tankInfo = tankDetails[tank.tankId];
  const terrainEffects = getTerrainEffects(map, tank.position);

  const adjustedMovement = tankInfo.movement * terrainEffects.movementEffect;
  const adjustedCombat = tankInfo.combat * terrainEffects.combatEffect;

  return {
    ...tank,
    outcome: 'survived',
    adjustedMovement,
    adjustedCombat
  };
};

const simulateEngagements = (map, alliesTanks, axisTanks, tankDetails) => {
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

  alliesTanks.forEach(tank => {
    const adjustedTank = calculateAdjustedAttributes(tank, tankDetails, map);
    outcomes.allies.tanks.push(adjustedTank);
    const adjustedTank = calculateAdjustedAttributes(tank, tankDetails, map);
    outcomes.allies.tanks.push(adjustedTank);
  });

  axisTanks.forEach(tank => {
    const adjustedTank = calculateAdjustedAttributes(tank, tankDetails, map);
    adjustedTank.outcome = 'destroyed'; // Assuming all axis tanks are destroyed
    outcomes.axis.tanks.push(adjustedTank);
    const adjustedTank = calculateAdjustedAttributes(tank, tankDetails, map);
    adjustedTank.outcome = 'destroyed'; // Assuming all axis tanks are destroyed
    outcomes.axis.tanks.push(adjustedTank);
  });

  outcomes.shotsFired = alliesTanks.length + axisTanks.length;
  outcomes.allies.damageDealt = outcomes.allies.tanks.reduce((sum, tank) => sum + tank.adjustedCombat, 0);
  outcomes.axis.damageDealt = outcomes.axis.tanks.reduce((sum, tank) => sum + tank.adjustedCombat, 0);
  outcomes.allies.damageDealt = outcomes.allies.tanks.reduce((sum, tank) => sum + tank.adjustedCombat, 0);
  outcomes.axis.damageDealt = outcomes.axis.tanks.reduce((sum, tank) => sum + tank.adjustedCombat, 0);
  outcomes.axis.tanksDestroyed = axisTanks.length;

  return outcomes;
};

module.exports = {
  simulateBattle,
};