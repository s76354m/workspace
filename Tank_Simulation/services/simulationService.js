const Tank = require('../models/Tank');
const Map = require('../models/Map');
const SimulationResult = require('../models/SimulationResult'); // Import SimulationResult model

const processTankActions = (tanks, targetTanks, battleStats, roundStats, side) => {
  tanks.forEach((tank, index) => {
    const targetIndex = Math.floor(Math.random() * targetTanks.length);
    const target = targetTanks[targetIndex];
    const damage = Math.random() * tank.mainGunPenetration;
    target.frontalArmor -= damage;
    battleStats.shotsFired++;
    if (target.frontalArmor <= 0) {
      console.log(`Tank ${target._id} destroyed by ${side} tank ${tank._id}`);
      roundStats[side === 'allies' ? 'axis' : 'allies'].push({ tankId: target._id, destroyed: true, x: target.x, y: target.y, z: target.z });
      battleStats.tanksDestroyed[side === 'allies' ? 'axis' : 'allies']++;
      targetTanks.splice(targetIndex, 1);
    } else {
      console.log(`Tank ${target._id} hit by ${side} tank ${tank._id}, remaining armor: ${target.frontalArmor}`);
      roundStats[side === 'allies' ? 'axis' : 'allies'].push({ tankId: target._id, destroyed: false, x: target.x, y: target.y, z: target.z });
    }

    // Update tank position (example movement logic)
    tank.x += (side === 'allies' ? 1 : -1);
    tank.y += 0;
    tank.z += 0;
    console.log(`Tank ${tank._id} moved to position (${tank.x, tank.y, tank.z})`);
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

    console.log('Fetched tank and map data successfully.');
    console.log('Initial Allies Tanks:', alliesTanks);
    console.log('Initial Axis Tanks:', axisTanks);

    // Initialize battle statistics
    const battleStats = {
      shotsFired: 0,
      tanksDestroyed: {
        allies: 0,
        axis: 0,
      },
      rounds: []
    };

    // Simplified example of simulation logic
    const simulateRound = (allies, axis) => {
      const roundStats = { allies: [], axis: [] };
      console.log('Simulating round...');
      processTankActions(allies, axis, battleStats, roundStats, 'allies');
      processTankActions(axis, allies, battleStats, roundStats, 'axis');
      console.log('Round simulation completed.');
      return roundStats;
    };

    while (alliesTanks.length > 0 && axisTanks.length > 0) {
      const roundStats = simulateRound(alliesTanks, axisTanks);
      battleStats.rounds.push(roundStats);
      console.log('Round stats:', roundStats);
    }

    console.log('Battle simulation completed successfully.');
    console.log('Final Battle Stats:', battleStats);
    return battleStats;
  } catch (error) {
    console.error(`Simulation error: ${error.message}`);
    console.error(error.stack);
    throw error;
  }
};

module.exports = { simulateBattle };