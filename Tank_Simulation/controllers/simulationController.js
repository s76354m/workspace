const { simulateBattle } = require('../services/simulationService');
const { startSimulationVisualization } = require('../services/visualizationService');

const startSimulation = async (req, res) => {
  const { alliesTanks, axisTanks, map } = req.body;

  try {
    console.log('Starting simulation with the following parameters:', { alliesTanks, axisTanks, map });
    const battleStats = await simulateBattle(alliesTanks, axisTanks, map);
    console.log('Simulation completed successfully. Battle stats:', battleStats);

    // Start the visualization process
    try {
      await startSimulationVisualization(alliesTanks, axisTanks, map, battleStats);
      console.log('Simulation visualization started successfully.');
    } catch (visualizationError) {
      console.error(`Error starting simulation visualization: ${visualizationError.message}`);
      console.error(visualizationError.stack);
      return res.status(500).json({ message: 'Error starting simulation visualization', error: visualizationError.message });
    }

    res.status(200).json(battleStats);
  } catch (error) {
    console.error(`Error starting simulation: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: 'Error starting simulation', error: error.message });
  }
};

module.exports = { startSimulation };