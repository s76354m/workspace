document.addEventListener('DOMContentLoaded', () => {
  const mapSelect = document.getElementById('map-selection');
  const startSimulationButton = document.getElementById('start-simulation');

  // Fetch tanks and populate the tank selection dropdowns
  fetch('/api/tanks')
    .then(response => response.json())
    .then(tanks => {
      tanks.forEach(tank => {
        const optionAllies = document.createElement('option');
        optionAllies.value = tank._id;
        optionAllies.textContent = `${tank.name} (Frontal Armor: ${tank.frontalArmor}, Side Armor: ${tank.sideArmor}, Gun Size: ${tank.mainGunSize}, Penetration: ${tank.mainGunPenetration})`;
        document.getElementById('allies-tank-selection').appendChild(optionAllies);

        const optionAxis = document.createElement('option');
        optionAxis.value = tank._id;
        optionAxis.textContent = `${tank.name} (Frontal Armor: ${tank.frontalArmor}, Side Armor: ${tank.sideArmor}, Gun Size: ${tank.mainGunSize}, Penetration: ${tank.mainGunPenetration})`;
        document.getElementById('axis-tank-selection').appendChild(optionAxis);
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
  const addTankPositionInputs = (container, side) => {
    const selectedTankId = side === 'allies' ? document.getElementById('allies-tank-selection').value : document.getElementById('axis-tank-selection').value;
    const tankPositionDiv = document.createElement('div');
    tankPositionDiv.className = 'tank-position';

    const label = document.createElement('label');
    label.textContent = `Position for ${side === 'allies' ? 'Allies' : 'Axis'} Tank (ID: ${selectedTankId}):`;
    tankPositionDiv.appendChild(label);

    const xInput = document.createElement('input');
    xInput.type = 'number';
    xInput.name = `${side}-tank-${selectedTankId}-x`;
    xInput.placeholder = 'X Coordinate';
    tankPositionDiv.appendChild(xInput);

    const yInput = document.createElement('input');
    yInput.type = 'number';
    yInput.name = `${side}-tank-${selectedTankId}-y`;
    yInput.placeholder = 'Y Coordinate';
    tankPositionDiv.appendChild(yInput);

    container.appendChild(tankPositionDiv);
  };

  // Event listener for starting the simulation
  startSimulationButton.addEventListener('click', () => {
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
        // Redirect to the simulation view or handle the response as needed
      })
      .catch(error => {
        console.error('Error starting simulation:', error.message);
        console.error(error.stack);
      });
  });
});