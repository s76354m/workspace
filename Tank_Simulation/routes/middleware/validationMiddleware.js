const validateSimulationRequest = (req, res, next) => {
  const { alliesTanks, axisTanks, map } = req.body;

  // Check if alliesTanks, axisTanks, and map are present
  if (!alliesTanks || !Array.isArray(alliesTanks) || alliesTanks.length === 0) {
    return res.status(400).json({ message: 'Allies tanks must be provided and should be a non-empty array' });
  }

  if (!axisTanks || !Array.isArray(axisTanks) || axisTanks.length === 0) {
    return res.status(400).json({ message: 'Axis tanks must be provided and should be a non-empty array' });
  }

  if (!map) {
    return res.status(400).json({ message: 'Map must be provided' });
  }

  // If all validations pass, proceed to the next middleware or route handler
  next();
};

module.exports = { validateSimulationRequest };