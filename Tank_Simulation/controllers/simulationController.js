const { simulateBattle } = require('../services/simulationService');

const startSimulation = async (req, res) => {
  const { alliesTanks, axisTanks, map } = req.body;

  try {
    console.log('Starting simulation with the following parameters:', { alliesTanks, axisTanks, map });
    const battleStats = await simulateBattle(alliesTanks, axisTanks, map);
    console.log('Simulation completed successfully. Battle stats:', battleStats);
    res.status(200).json(battleStats);
  } catch (error) {
    console.error(`Error starting simulation: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: 'Error starting simulation', error: error.message });
  }
};

module.exports = { startSimulation };