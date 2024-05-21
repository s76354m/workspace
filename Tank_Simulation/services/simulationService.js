const Tank = require('../models/Tank');
const Map = require('../models/Map');

const validateSimulationData = (tanks, map) => {
  if (!tanks.length || !map) {
    throw new Error('Invalid tank or map data');
  }
};

const processTankActions = (tanks, targetTanks, battleStats, roundStats, side) => {
  tanks.forEach((tank, index) => {
    const targetIndex = Math.floor(Math.random() * targetTanks.length);
    const target = targetTanks[targetIndex];
    const damage = Math.random() * tank.mainGunPenetration;
    target.frontalArmor -= damage;
    battleStats.shotsFired++;
    if (target.frontalArmor <= 0) {
      roundStats[side === 'allies' ? 'axis' : 'allies'].push({ tankId: target._id, destroyed: true, x: target.x, y: target.y, z: target.z });
      battleStats.tanksDestroyed[side === 'allies' ? 'axis' : 'allies']++;
      targetTanks.splice(targetIndex, 1);
    } else {
      roundStats[side === 'allies' ? 'axis' : 'allies'].push({ tankId: target._id, destroyed: false, x: target.x, y: target.y, z: target.z });
    }

    // Update tank position (example movement logic)
    tank.x += (side === 'allies' ? 1 : -1);
    tank.y += 0;
    tank.z += 0;
    roundStats[side].push({ tankId: tank._id, destroyed: false, x: tank.x, y: tank.y, z: tank.z });
  });
};

const simulateBattle = async (alliesTanksIds, axisTanksIds, mapId) => {
  try {
    console.log('Starting battle simulation...');

    // Fetch tanks and map data
    const alliesTanks = await Tank.find({ _id: { $in: alliesTanksIds } });
    const axisTanks = await Tank.find({ _id: { $in: axisTanksIds } });
    const map = await Map.findById(mapId).populate('terrains');

    validateSimulationData(alliesTanks, map);
    validateSimulationData(axisTanks, map);

    console.log('Fetched tank and map data successfully.');

    // Initialize battle statistics
    const battleStats = {
      shotsFired: 0,
      tanksDestroyed: {
        allies: 0,
        axis: 0,
      },
      rounds: [],
      alliesTanks: alliesTanks.map(tank => ({ _id: tank._id, x: 0, y: 0, z: 0 })),
      axisTanks: axisTanks.map(tank => ({ _id: tank._id, x: 0, y: 0, z: 0 })),
    };

    // Simplified example of simulation logic
    const simulateRound = (allies, axis) => {
      const roundStats = { allies: [], axis: [] };
      processTankActions(allies, axis, battleStats, roundStats, 'allies');
      processTankActions(axis, allies, battleStats, roundStats, 'axis');
      return roundStats;
    };

    while (alliesTanks.length > 0 && axisTanks.length > 0) {
      const roundStats = simulateRound(alliesTanks, axisTanks);
      battleStats.rounds.push(roundStats);
    }

    console.log('Battle simulation completed successfully.');
    return battleStats;
  } catch (error) {
    console.error(`Simulation error: ${error.message}`);
    console.error(error.stack);
    throw error;
  }
};

module.exports = { simulateBattle };