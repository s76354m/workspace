const { addTankToScene } = require('./threeInit.js');

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
    setTimeout(() => {
      errorMessageElement.classList.add('d-none');
    }, 5000);
  };

  const handleError = (error, message) => {
    console.error(message, error);
    showError(message);
  };

  const addTanksToScene = (tanksData) => {
    return tanksData.map(tank => {
      return addTankToScene(scene, tank.x, tank.y, tank.z);
    });
  };

  const updateTankPositions = (rounds, alliesTanks, axisTanks) => {
    rounds.forEach(round => {
      round.allies.forEach((action, index) => {
        const tank = alliesTanks[index];
        if (tank) {
          if (action.destroyed) {
            console.log(`Removing destroyed Allies tank at index ${index} with ID ${action.tankId}`);
            scene.remove(tank);
          } else {
            console.log(`Updating position of Allies tank at index ${index} with ID ${action.tankId} to (${action.x}, ${action.y}, ${action.z})`);
            tank.position.set(action.x, action.y, action.z);
          }
        }
      });
      round.axis.forEach((action, index) => {
        const tank = axisTanks[index];
        if (tank) {
          if (action.destroyed) {
            console.log(`Removing destroyed Axis tank at index ${index} with ID ${action.tankId}`);
            scene.remove(tank);
          } else {
            console.log(`Updating position of Axis tank at index ${index} with ID ${action.tankId} to (${action.x}, ${action.y}, ${action.z})`);
            tank.position.set(action.x, action.y, action.z);
          }
        }
      });
    });
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

        console.log('Terrain data received:', map.terrains);

        while (scene.children.length > 0) {
          scene.remove(scene.children[0]);
        }

        map.terrains.forEach(terrain => {
          addTerrainToScene(scene, terrain.type, terrain.x, terrain.y, terrain.z);
        });
      })
      .catch(error => {
        handleError(error, 'Error fetching map data. Please try again later.');
      });
  });

  document.getElementById('setup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const alliesTanksIds = Array.from(alliesTanksSelect.selectedOptions).map(option => option.value);
    const axisTanksIds = Array.from(axisTanksSelect.selectedOptions).map(option => option.value);
    const selectedMapId = mapSelect.value;

    if (alliesTanksIds.length === 0 || axisTanksIds.length === 0) {
      showError('Please select at least one tank for both Allies and Axis.');
      return;
    }

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
        console.log('Simulation start response:', data); // Detailed logging of the response

        if (data.message === 'Simulation started successfully' && data.simulationId) {
          console.log('Adding Allies tanks to scene:', data.alliesTanks);
          const alliesTanks = addTanksToScene(data.alliesTanks);
          console.log('Adding Axis tanks to scene:', data.axisTanks);
          const axisTanks = addTanksToScene(data.axisTanks);
          console.log('Updating tank positions with rounds data:', data.rounds);
          updateTankPositions(data.rounds, alliesTanks, axisTanks);
          window.location.href = `/api/simulation/results/${data.simulationId}`;
        } else {
          showError('Error starting simulation. Please try again later.');
        }
      })
      .catch(error => {
        handleError(error, 'Error starting simulation. Please try again later.');
      });
  });
});