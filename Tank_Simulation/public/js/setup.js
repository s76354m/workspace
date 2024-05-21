const { addTerrainToScene, addTankToScene } = require('./threeInit.js');

document.addEventListener('DOMContentLoaded', function() {
  const mapSelect = document.getElementById('map');
  const mapContainer = document.getElementById('map-container');
  const errorMessageElement = document.getElementById('error-message');
  const alliesTanksSelect = document.getElementById('allies-tanks');
  const axisTanksSelect = document.getElementById('axis-tanks');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, mapContainer.clientWidth / mapContainer.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(mapContainer.clientWidth, mapContainer.clientHeight);
  mapContainer.appendChild(renderer.domElement);

  camera.position.z = 10;

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  console.log('Three.js scene initialized successfully');

  const showError = (message) => {
    errorMessageElement.textContent = message;
    errorMessageElement.classList.remove('d-none');
  };

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

        // Log terrain data for debugging
        console.log('Terrain data received:', map.terrains);

        // Clear the Three.js scene
        while (scene.children.length > 0) {
          scene.remove(scene.children[0]);
        }

        map.terrains.forEach(terrain => {
          addTerrainToScene(scene, terrain.type, terrain.x, terrain.y, terrain.z);
        });
      })
      .catch(error => {
        console.error('Error fetching map data:', error);
        console.error(error.stack);
        showError('Error fetching map data. Please try again later.');
      });
  });

  document.getElementById('setup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const alliesTanksIds = Array.from(alliesTanksSelect.selectedOptions).map(option => option.value);
    const axisTanksIds = Array.from(axisTanksSelect.selectedOptions).map(option => option.value);
    const selectedMapId = mapSelect.value;

    fetch('/api/simulation/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        alliesTanks: alliesTanksIds,
        axisTanks: axisTanksIds,
        map: selectedMapId,
      }),
    })
      .then(response => response.json())
      .then(data => {
        // Add tanks to the scene
        const alliesTanks = data.alliesTanks.map(tank => {
          return addTankToScene(scene, 'allies', tank.x, tank.y, tank.z);
        });

        const axisTanks = data.axisTanks.map(tank => {
          return addTankToScene(scene, 'axis', tank.x, tank.y, tank.z);
        });

        // Simulate tank movements (simplified example)
        data.rounds.forEach(round => {
          round.allies.forEach((action, index) => {
            const tank = alliesTanks[index];
            if (tank) {
              if (action.destroyed) {
                scene.remove(tank);
              } else {
                tank.position.set(action.x, action.y, action.z);
              }
            }
          });
          round.axis.forEach((action, index) => {
            const tank = axisTanks[index];
            if (tank) {
              if (action.destroyed) {
                scene.remove(tank);
              } else {
                tank.position.set(action.x, action.y, action.z);
              }
            }
          });
        });
      })
      .catch(error => {
        console.error('Error starting simulation:', error);
        showError('Error starting simulation. Please try again later.');
      });
  });
});