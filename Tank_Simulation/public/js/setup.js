const { initThreeScene, addTerrainToScene, updateTankPosition, addTankToScene } = require('./threeInit.js');
const { getTankModel } = require('./tankModels.js');
const { startSimulation } = require('./simulationVisualization.js');

document.addEventListener('DOMContentLoaded', function() {
  const mapSelect = document.getElementById('map');
  const mapContainer = document.getElementById('map-container');
  const errorMessageElement = document.getElementById('error-message');
  const alliesTanksSelect = document.getElementById('allies-tanks');
  const axisTanksSelect = document.getElementById('axis-tanks');

  const { scene } = initThreeScene(mapContainer);

  function setupScene(map, data) {
    // Clear the Three.js scene
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }

    // Add terrains to the scene
    const terrainCoordinates = {
      'forest': { x: -2, y: 0, z: 0 },
      'hill': { x: 2, y: 0, z: 0 },
      'city': { x: 0, y: 0, z: 2 },
      'plain': { x: 0, y: 0, z: -2 }
    };

    map.terrains.forEach(terrain => {
      if (!terrain.type || typeof terrain.coordinates === 'undefined') {
        console.error('Terrain data missing type or coordinates property');
        return;
      }
      const coords = terrainCoordinates[terrain.type] || { x: 0, y: 0, z: 0 };
      addTerrainToScene(scene, terrain.type, coords.x, coords.y, coords.z);
    });

    // Add tanks to the scene
    const tankCoordinates = {
      'allies': { x: -1, y: 0, z: 0 },
      'axis': { x: 1, y: 0, z: 0 }
    };

    data.alliesTanks.forEach((tankId, index) => {
      getTankModel(tankId, (error, tankModel) => {
        if (error) {
          console.error('Error loading tank model:', error);
          return;
        }
        const coords = { x: tankCoordinates.allies.x + index, y: tankCoordinates.allies.y, z: tankCoordinates.allies.z };
        addTankToScene(scene, tankModel, coords.x, coords.y, coords.z);
      });
    });

    data.axisTanks.forEach((tankId, index) => {
      getTankModel(tankId, (error, tankModel) => {
        if (error) {
          console.error('Error loading tank model:', error);
          return;
        }
        const coords = { x: tankCoordinates.axis.x + index, y: tankCoordinates.axis.y, z: tankCoordinates.axis.z };
        addTankToScene(scene, tankModel, coords.x, coords.y, coords.z);
      });
    });
  }

  mapSelect.addEventListener('change', function() {
    const selectedMapId = mapSelect.value;

    fetch(`/api/maps/${selectedMapId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(map => {
        if (!map || !Array.isArray(map.terrains)) {
          throw new Error('Invalid map data received from the server');
        }
        setupScene(map, { alliesTanks: [], axisTanks: [] });
      })
      .catch(error => {
        console.error('Error fetching map data:', error);
        console.error(error.stack);
        errorMessageElement.textContent = 'Error fetching map data. Please try again later.';
        errorMessageElement.classList.remove('d-none');
      });
  });

  document.getElementById('setup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const alliesTanks = Array.from(alliesTanksSelect.selectedOptions).map(option => option.value);
    const axisTanks = Array.from(axisTanksSelect.selectedOptions).map(option => option.value);
    const selectedMapId = mapSelect.value;

    fetch('/api/simulation/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        alliesTanks,
        axisTanks,
        map: selectedMapId,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Simulation results:', data);
        setupScene(data.map, data);

        // Start simulation visualization
        const simulationContainer = document.getElementById('simulation-container');
        startSimulation(simulationContainer, alliesTanks, axisTanks);

        // Update tank positions based on simulation results
        data.rounds.forEach((round, roundIndex) => {
          setTimeout(() => {
            round.allies.forEach((tank, index) => {
              const tankModel = scene.getObjectByName(tank.tankId);
              if (tankModel) {
                const coords = { x: tankCoordinates.allies.x + index, y: tankCoordinates.allies.y, z: tankCoordinates.allies.z + roundIndex };
                updateTankPosition(tankModel, coords.x, coords.y, coords.z);
              }
            });

            round.axis.forEach((tank, index) => {
              const tankModel = scene.getObjectByName(tank.tankId);
              if (tankModel) {
                const coords = { x: tankCoordinates.axis.x + index, y: tankCoordinates.axis.y, z: tankCoordinates.axis.z + roundIndex };
                updateTankPosition(tankModel, coords.x, coords.y, coords.z);
              }
            });
          }, roundIndex * 1000); // Adjust the timing as needed
        });
      })
      .catch(error => {
        console.error('Error starting simulation:', error);
        errorMessageElement.textContent = 'Error starting simulation. Please try again later.';
        errorMessageElement.classList.remove('d-none');
      });
  });
});