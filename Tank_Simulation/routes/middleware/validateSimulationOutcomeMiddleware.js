const validateSimulationOutcomeMiddleware = (req, res, next) => {
    if (res.locals.simulationResults && !res.locals.simulationResults.outcomes) {
        console.log("Simulation results format is incorrect. Adjusting to expected format.");
        const adjustedResults = { outcomes: res.locals.simulationResults };
        res.locals.simulationResults = adjustedResults;
    } else if (!res.locals.simulationResults) {
        console.error("Simulation results are missing.");
    } else {
        console.log("Simulation results format is correct.");
    }
    next();
};

module.exports = validateSimulationOutcomeMiddleware;