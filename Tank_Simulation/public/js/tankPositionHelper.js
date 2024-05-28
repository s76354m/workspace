export const createTankPositionDiv = (selectedTankSide, selectedTankId, x, y) => {
  try {
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

    return tankPositionDiv;
  } catch (error) {
    console.error('Error creating tank position div:', error.message);
    console.error(error.stack);
    throw error;
  }
};