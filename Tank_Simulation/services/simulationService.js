const Tank = require('../models/Tank');
const Map = require('../models/Map');

const simulateBattle = async (alliesTanksIds, axisTanksIds, mapId) => {
  try {
    console.log('Starting battle simulation...');
    
    // Fetch tanks and map data
    const alliesTanks = await Tank.find({ _id: { $in: alliesTanksIds } });
    const axisTanks = await Tank.find({ _id: { $in: axisTanksIds } });
    const map = await Map.findById(mapId).populate('terrains');

    if (!alliesTanks.length || !axisTanks.length || !map) {
      throw new Error('Invalid tank or map data');
    }

    console.log('Fetched tank and map data successfully.');

    // Initialize battle statistics
    const battleStats = {
      shotsFired: 0,
      tanksDestroyed: {
        allies: 0,
        axis: 0,
      },
      rounds: [],
    };

    // Simplified example of simulation logic
    const simulateRound = (allies, axis) => {
      const roundStats = {
        allies: [],
        axis: [],
      };

      // Simulate shots fired by allies
      allies.forEach((tank) => {
        const targetIndex = Math.floor(Math.random() * axis.length);
        const target = axis[targetIndex];
        const damage = Math.random() * tank.mainGunPenetration;
        target.frontalArmor -= damage;
        battleStats.shotsFired++;
        if (target.frontalArmor <= 0) {
          roundStats.axis.push({ tankId: target._id, destroyed: true });
          battleStats.tanksDestroyed.axis++;
          axis.splice(targetIndex, 1);
        } else {
          roundStats.axis.push({ tankId: target._id, destroyed: false });
        }
      });

      // Simulate shots fired by axis
      axis.forEach((tank) => {
        const targetIndex = Math.floor(Math.random() * allies.length);
        const target = allies[targetIndex];
        const damage = Math.random() * tank.mainGunPenetration;
        target.frontalArmor -= damage;
        battleStats.shotsFired++;
        if (target.frontalArmor <= 0) {
          roundStats.allies.push({ tankId: target._id, destroyed: true });
          battleStats.tanksDestroyed.allies++;
          allies.splice(targetIndex, 1);
        } else {
          roundStats.allies.push({ tankId: target._id, destroyed: false });
        }
      });

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