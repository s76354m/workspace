const gridSize = 20; // Size of each grid cell

const drawGrid = (context, canvas) => {
  const rows = canvas.height / gridSize;
  const cols = canvas.width / gridSize;

  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw rows
  for (let i = 0; i <= rows; i++) {
    context.beginPath();
    context.moveTo(0, i * gridSize);
    context.lineTo(canvas.width, i * gridSize);
    context.strokeStyle = '#ddd';
    context.stroke();
  }

  // Draw columns
  for (let j = 0; j <= cols; j++) {
    context.beginPath();
    context.moveTo(j * gridSize, 0);
    context.lineTo(j * gridSize, canvas.height);
    context.strokeStyle = '#ddd';
    context.stroke();
  }
};

const getTerrainColor = (type) => {
  switch (type) {
    case 'forest':
      return 'green';
    case 'hill':
      return 'brown';
    case 'city':
      return 'gray';
    default:
      return 'white';
  }
};

const fillTerrainCells = (context, terrainData) => {
  terrainData.forEach(terrain => {
    const { x, y, type } = terrain;
    context.fillStyle = getTerrainColor(type);
    context.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
  });
};

const renderTerrain = (context, map) => {
  if (!map || !map.terrains) {
    console.error('No terrain data available for the selected map.');
    return;
  }
  const terrainData = map.terrains;
  fillTerrainCells(context, terrainData);
};

export {
  drawGrid,
  getTerrainColor,
  fillTerrainCells,
  renderTerrain
};