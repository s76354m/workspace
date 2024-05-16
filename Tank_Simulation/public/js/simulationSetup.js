document.addEventListener('DOMContentLoaded', function () {
    const setupForm = document.getElementById('simulationSetupForm');
    const mapCanvas = document.getElementById('mapCanvas');

    if (!setupForm || !mapCanvas) {
        console.error('Setup form or map canvas not found.');
        return;
    }

    let tankPositions = [];

    mapCanvas.addEventListener('click', function (e) {
        const rect = mapCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        console.log(`Click event: (${e.clientX}, ${e.clientY}), Canvas bounds: (${rect.left}, ${rect.top}, ${rect.right}, ${rect.bottom})`);

        // Ensure click coordinates are within the canvas bounds
        if (x >= 0 && x <= mapCanvas.width && y >= 0 && y <= mapCanvas.height) {
            tankPositions.push({ x: Math.round(x), y: Math.round(y) });
            console.log(`Tank position added at (${x}, ${y})`);
            console.log('Current tank positions:', tankPositions);
        } else {
            console.error('Click outside canvas bounds, position not added.');
        }
    });

    setupForm.onsubmit = async function (e) {
        e.preventDefault();

        // Validate tankPositions before submitting
        if (tankPositions.length === 0 || !tankPositions.every(pos => 'x' in pos && 'y' in pos && typeof pos.x === 'number' && typeof pos.y === 'number')) {
            console.error('Error: No valid tank positions added. Each position must include x and y coordinates as numbers.');
            alert('Error: No valid tank positions added. Each position must include x and y coordinates as numbers.');
            return; // Prevent form submission if validation fails
        }

        console.log('Submitting tank positions:', tankPositions);

        const mapSelect = document.getElementById('mapSelect');
        const mapId = mapSelect ? mapSelect.value : null;
        const tankInputs = document.querySelectorAll('input[type="checkbox"][name^="tanks"]:checked');

        const tanks = Array.from(tankInputs).map(input => {
            const tankId = input.getAttribute('data-tank-id');
            const quantityInput = input.closest('.input-group').querySelector('input[type="number"]');
            const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 0;
            if (isNaN(quantity)) {
                console.error(`Error parsing quantity for tank ID ${tankId}`);
                alert(`Error parsing quantity for tank ID ${tankId}`);
                return;
            }
            return { id: tankId, quantity: quantity };
        }).filter(tank => tank !== undefined);

        try {
            const response = await fetch('/simulation/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tanks, mapId, tankPositions }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Simulation results:', data);
            if (data && typeof data === 'object' && data.outcomes) {
                updateVisualization(data.outcomes);
            } else {
                console.error('Error: Unexpected simulation results format:', data);
                alert('Error: Unexpected simulation results format. Please check the console for more details.');
            }
        } catch (error) {
            console.error('Error starting simulation:', error.message, error.stack);
            alert('Error starting simulation. Please check the console for more details.');
        }
    };
});

async function updateVisualization(simulationResults) {
    try {
        const { visualizationApi } = await import('./battleVisualization.js');
        
        if (Array.isArray(simulationResults)) {
            // Handle array format
            simulationResults.forEach(result => {
                console.log('Processing result:', result);
                if (result.status === 'knocked_out') {
                    console.log(`Tank with ID ${result.tankId} was knocked out.`);
                } else {
                    if (!result.tankId || !result.position || typeof result.position.x !== 'number' || typeof result.position.y !== 'number') {
                        console.error('Invalid result:', result);
                        return;
                    }
                    if (!tanks[result.tankId]) {
                        visualizationApi.addTank(result.tankId, result.position, 'green');
                    } else {
                        visualizationApi.moveTank(result.tankId, result.position);
                    }
                }
            });
            visualizationApi.updateWithSimulationResults(simulationResults);
        } else if (typeof simulationResults === 'object') {
            // Handle object format
            const resultsArray = Object.keys(simulationResults).map(key => {
                const result = simulationResults[key];
                console.log('Processing result:', result);
                if (result && typeof result === 'object' && result.tankId && result.position && typeof result.position.x === 'number' && typeof result.position.y === 'number') {
                    return result;
                } else {
                    console.error('Invalid result format:', result);
                    return null;
                }
            }).filter(result => result !== null);
            visualizationApi.updateWithSimulationResults(resultsArray);
        } else {
            console.error('Invalid simulation results format for visualization update', simulationResults);
        }
    } catch (error) {
        console.error('Error updating visualization:', error.message, error.stack);
    }
}