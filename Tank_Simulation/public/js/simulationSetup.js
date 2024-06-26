import { createTankPositionDiv } from './tankPositionHelper.js';

document.addEventListener('DOMContentLoaded', () => {
  const mapSelect = document.getElementById('map-selection');
  const simulationForm = document.getElementById('simulation-setup-form');
  const alliesTankSelect = document.getElementById('allies-tank');
  const axisTankSelect = document.getElementById('axis-tank');
  const tankPositioningContainer = document.getElementById('tank-positioning');
  const canvas = document.getElementById('battlefield-canvas');
  const gridSize = 20; // Size of each grid cell
  let selectedTankSide = null;
  let selectedTankId = null;

  // Fetch tanks and populate the tank selection dropdowns
  fetch('/api/tanks')
    .then(response => response.json())
    .then(tanks => {
      tanks.forEach(tank => {
        appendTankOptions(tank, alliesTankSelect);
        appendTankOptions(tank, axisTankSelect);
      });
    })
    .catch(error => {
      console.error('Error fetching tanks:', error.message);
      console.error(error.stack);
    });

  // Fetch maps and populate the map selection dropdown
  fetch('/api/maps')
    .then(response => response.json())
    .then(maps => {
      maps.forEach(map => {
        const option = document.createElement('option');
        option.value = map._id;
        option.textContent = map.name;
        mapSelect.appendChild(option);
      });
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
      const x = parseInt(inputs[0].value, 10);
      const y = parseInt(inputs[1].value, 10);

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
        // Redirect to the simulation results page
        window.location.href = '/simulation-results';
      })
      .catch(error => {
        console.error('Error starting simulation:', error.message);
        console.error(error.stack);
        alert('Failed to start simulation. Please try again later.');
      });
  });
});