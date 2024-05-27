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
    console.error('Error in simulateBattle:', error.message);
    console.error(error.stack);
    throw error;
  }
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