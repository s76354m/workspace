const { initThreeScene, addTerrainToScene } = require('./threeInit.js');

document.addEventListener('DOMContentLoaded', function() {
  const mapSelect = document.getElementById('map');
  const mapContainer = document.getElementById('map-container');
  const errorMessageElement = document.getElementById('error-message');
  const alliesTanksSelect = document.getElementById('allies-tanks');
  const axisTanksSelect = document.getElementById('axis-tanks');

  const { scene } = initThreeScene(mapContainer);

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

        // Clear the Three.js scene
        while (scene.children.length > 0) {
          scene.remove(scene.children[0]);
        }

        // Define coordinates for different terrains
        const terrainCoordinates = {
          'forest': { x: -2, y: 0, z: 0 },
          'hill': { x: 2, y: 0, z: 0 },
          'city': { x: 0, y: 0, z: 2 },
          'plain': { x: 0, y: 0, z: -2 }
        };

        map.terrains.forEach(terrain => {
          if (!terrain.type) {
            console.error('Terrain data missing type property');
            return;
          }
          const coords = terrainCoordinates[terrain.type] || { x: 0, y: 0, z: 0 };

          // Log the terrain type and coordinates
          console.log(`Adding terrain of type ${terrain.type} at coordinates (${coords.x}, ${coords.y}, ${coords.z})`);

          addTerrainToScene(scene, terrain.type, coords.x, coords.y, coords.z);
        });
      })
      .catch(error => {
        console.error('Error fetching map data:', error);
        console.error(error.stack);
        errorMessageElement.textContent = 'Error fetching map data. Please try again later.';
        errorMessageElement.classList.remove('d-none');
      });
  });

  // Move the form submission event listener here to add it only once
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
        // Display simulation results to the user
        // (Implement this based on your UI design)
      })
      .catch(error => {
        console.error('Error starting simulation:', error);
        errorMessageElement.textContent = 'Error starting simulation. Please try again later.';
        errorMessageElement.classList.remove('d-none');
      });
  });
});