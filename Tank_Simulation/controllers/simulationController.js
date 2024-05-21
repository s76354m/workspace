const { simulateBattle } = require('../services/simulationService');
const SimulationResult = require('../models/SimulationResult'); // Assuming a new model for storing simulation results

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

    // Store the battleStats in the database
    const simulationResult = new SimulationResult(battleStats);
    await simulationResult.save();
    res.status(200).json({ message: 'Simulation started successfully', simulationId: simulationResult._id });
  } catch (error) {
    console.error(`Error starting simulation: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: 'Error starting simulation', error: error.message });
  }
};

const getSimulationResults = async (req, res) => {
  const { simulationId } = req.params;
  
  try {
    const simulationResults = await SimulationResult.findById(simulationId);
    if (!simulationResults) {
      return res.status(404).json({ message: 'Simulation results not found' });
    }
    res.render('results', { simulationResults });
  } catch (error) {
    console.error(`Error retrieving simulation results: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: 'Error retrieving simulation results', error: error.message });
  }
};

module.exports = { startSimulation, getSimulationResults };