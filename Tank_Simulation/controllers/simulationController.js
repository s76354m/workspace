const { simulateBattle } = require('../services/simulationService');

const startSimulation = async (req, res) => {
  const { alliesTanks, axisTanks, map } = req.body;

  // Validate the presence of alliesTanks and axisTanks
  if (!alliesTanks || !axisTanks) {
    return res.status(400).json({ message: 'Both alliesTanks and axisTanks must be provided' });
  }

  try {
    console.log('Starting simulation with the following parameters:', { alliesTanks, axisTanks, map });
    const battleStats = await simulateBattle(alliesTanks, axisTanks, map);
    console.log('Simulation completed successfully. Battle stats:', battleStats);

    // Store the battleStats in the session or database for later retrieval
    req.session.simulationResults = battleStats;
    res.status(200).json({ message: 'Simulation started successfully', simulationId: 'current' });
  } catch (error) {
    console.error(`Error starting simulation: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: 'Error starting simulation', error: error.message });
  }
};

const getSimulationResults = (req, res) => {
  // Retrieve the simulation results from the session or database
  const simulationResults = req.session.simulationResults;
  if (!simulationResults) {
    return res.status(404).json({ message: 'Simulation results not found' });
  }

  res.render('results', { simulationResults });
};

module.exports = { startSimulation, getSimulationResults };