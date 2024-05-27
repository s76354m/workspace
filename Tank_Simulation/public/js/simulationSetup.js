document.addEventListener('DOMContentLoaded', () => {
  const mapSelect = document.getElementById('map-selection');
  const simulationForm = document.getElementById('simulation-setup-form');
  const alliesTankSelect = document.getElementById('allies-tank');
  const axisTankSelect = document.getElementById('axis-tank');
  const tankPositioningContainer = document.getElementById('tank-positioning');

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

  // Function to add tank position inputs
  const addTankPositionInputs = (container, side, tankId, quantity) => {
    for (let i = 0; i < quantity; i++) {
      const tankPositionDiv = document.createElement('div');
      tankPositionDiv.className = 'tank-position';

      const label = document.createElement('label');
      label.textContent = `Position for ${side === 'allies' ? 'Allies' : 'Axis'} Tank (ID: ${tankId}):`;
      tankPositionDiv.appendChild(label);

      const xInput = document.createElement('input');
      xInput.type = 'number';
      xInput.name = `${side}-tank-${tankId}-x`;
      xInput.placeholder = 'X Coordinate';
      tankPositionDiv.appendChild(xInput);

      const yInput = document.createElement('input');
      yInput.type = 'number';
      yInput.name = `${side}-tank-${tankId}-y`;
      yInput.placeholder = 'Y Coordinate';
      tankPositionDiv.appendChild(yInput);

      container.appendChild(tankPositionDiv);
    }
  };

  // General function to handle adding tank positions
  const handleAddTank = (tankSelect, quantityInput, side) => {
    const selectedTankId = tankSelect.value;
    const quantity = parseInt(quantityInput.value, 10);
    addTankPositionInputs(tankPositioningContainer, side, selectedTankId, quantity);
  };

  // Event listener for adding Allies tank positions
  document.getElementById('add-allies-tank').addEventListener('click', () => {
    handleAddTank(alliesTankSelect, document.getElementById('allies-quantity'), 'allies');
  });

  // Event listener for adding Axis tank positions
  document.getElementById('add-axis-tank').addEventListener('click', () => {
    handleAddTank(axisTankSelect, document.getElementById('axis-quantity'), 'axis');
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
      const x = inputs[0].value;
      const y = inputs[1].value;

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
});