import { drawGrid, renderTerrain } from './mapUtils.js';
import { drawTankIcon } from './tankUtils.js';

document.addEventListener('DOMContentLoaded', () => {
  const mapSelect = document.getElementById('map-selection');
  const simulationForm = document.getElementById('simulation-setup-form');
  const alliesTankSelect = document.getElementById('allies-tank');
  const axisTankSelect = document.getElementById('axis-tank');
  const tankPositioningContainer = document.getElementById('tank-positioning');
  const canvas = document.getElementById('battlefield-canvas');
  const context = canvas.getContext('2d');
  const gridSize = 20; // Size of each grid cell
  let selectedTankSide = null;
  let selectedTankId = null;
  let maps = []; // Store maps data

  // Fetch tanks and populate the tank selection dropdowns
  fetch('/api/tanks')
    .then(response => response.json())
    .then(tanks => {
      tanks.forEach(tank => {
        const alliesOption = document.createElement('option');
        alliesOption.value = tank._id;
        alliesOption.textContent = `${tank.name} (Frontal Armor: ${tank.frontalArmor}, Side Armor: ${tank.sideArmor}, Gun Size: ${tank.mainGunSize}, Penetration: ${tank.mainGunPenetration})`;
        alliesTankSelect.appendChild(alliesOption);

        const axisOption = document.createElement('option');
        axisOption.value = tank._id;
        axisOption.textContent = `${tank.name} (Frontal Armor: ${tank.frontalArmor}, Side Armor: ${tank.sideArmor}, Gun Size: ${tank.mainGunSize}, Penetration: ${tank.mainGunPenetration})`;
        axisTankSelect.appendChild(axisOption);
      });
    })
    .catch(error => {
      console.error('Error fetching tanks:', error.message);
      console.error(error.stack);
    });

  // Fetch maps and populate the map selection dropdown
  fetch('/api/maps')
    .then(response => response.json())
    .then(fetchedMaps => {
      maps = fetchedMaps;
      maps.forEach(map => {
        const option = document.createElement('option');
        option.value = map._id;
        option.textContent = map.name;
        mapSelect.appendChild(option);
      });
      if (maps.length > 0) {
        renderTerrain(context, maps[0]);  // Render the first map by default
      } else {
        console.error('No maps available');
      }
    })
    .catch(error => {
      console.error('Error fetching maps:', error.message);
      console.error(error.stack);
    });

  // General function to handle adding tank positions
  const handleAddTankClick = (side, tankSelect) => {
    selectedTankSide = side;
    selectedTankId = tankSelect.value;
  };

  // Event listener for adding Allies tank positions
  document.getElementById('add-allies-tank').addEventListener('click', () => handleAddTankClick('allies', alliesTankSelect));

  // Event listener for adding Axis tank positions
  document.getElementById('add-axis-tank').addEventListener('click', () => handleAddTankClick('axis', axisTankSelect));

  // Event listener to place tanks on the grid
  canvas.addEventListener('click', (event) => {
    if (!selectedTankSide || !selectedTankId) {
      alert('Please select a tank and side before placing it on the grid.');
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / gridSize);
    const y = Math.floor((event.clientY - rect.top) / gridSize);

    const tankPositionDiv = document.createElement('div');
    tankPositionDiv.className = 'tank-position';

    const label = document.createElement('label');
    label.textContent = `Position for ${selectedTankSide === 'allies' ? 'Allies' : 'Axis'} Tank (ID: ${selectedTankId}):`;
    tankPositionDiv.appendChild(label);

    const xInput = document.createElement('input');
    xInput.type = 'number';
    xInput.name = `${selectedTankSide}-tank-${selectedTankId}-x`;
    xInput.value = x;
    xInput.readOnly = true;
    tankPositionDiv.appendChild(xInput);

    const yInput = document.createElement('input');
    yInput.type = 'number';
    yInput.name = `${selectedTankSide}-tank-${selectedTankId}-y`;
    yInput.value = y;
    yInput.readOnly = true;
    tankPositionDiv.appendChild(yInput);

    tankPositioningContainer.appendChild(tankPositionDiv);

    // Draw the tank icon on the grid
    drawTankIcon(context, x, y, selectedTankSide);

    // Reset selection
    selectedTankSide = null;
    selectedTankId = null;
  });

  // Event listener for form submission
  simulationForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const selectedMapId = mapSelect.value;
    const alliesTanks = [];
    const axisTanks = [];

    document.querySelectorAll('.tank-position').forEach(positionDiv => {
      const inputs = positionDiv.querySelectorAll('input');
      const tankId = inputs[0].name.split('-')[2];
      const x = Number(inputs[0].value);
      const y = Number(inputs[1].value);

      if (inputs[0].name.startsWith('allies')) {
        alliesTanks.push({ tankId, x, y });
      } else {
        axisTanks.push({ tankId, x, y });
      }
    });

    const simulationData = {
      mapId: selectedMapId,
      alliesTanks,
      axisTanks
    };

    fetch('/api/start-simulation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(simulationData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Simulation started:', data);
        // Redirect to the simulation results page
        window.location.href = '/simulation-results';
      })
      .catch(error => {
        console.error('Error starting simulation:', error.message);
        console.error(error.stack);
      });
  });

  // Event listener for map selection
  mapSelect.addEventListener('change', (event) => {
    const selectedMapId = event.target.value;
    drawGrid(context, canvas);
    const selectedMap = maps.find(map => map._id === selectedMapId);
    if (selectedMap) {
      renderTerrain(context, selectedMap);
    } else {
      console.error('Selected map not found in the maps array.');
    }
  });

  // Initial grid drawing
  drawGrid(context, canvas);
});