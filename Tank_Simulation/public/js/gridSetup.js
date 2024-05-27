document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('battlefield-canvas');
  const context = canvas.getContext('2d');
  const gridSize = 20; // Size of each grid cell
  let maps = []; // Store maps data

  // Function to draw the grid
  const drawGrid = () => {
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

  // Function to fill terrain cells
  const fillTerrainCells = (terrainData) => {
    terrainData.forEach(terrain => {
      const { x, y, type } = terrain;
      context.fillStyle = getTerrainColor(type);
      context.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
    });
  };

  // Function to get color based on terrain type
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

  // Function to render terrain on the grid
  const renderTerrain = (map) => {
    const terrainData = map.terrains;
    fillTerrainCells(terrainData);
  };

  // Event listener for map selection
  document.getElementById('map-selection').addEventListener('change', (event) => {
    const selectedMapId = event.target.value;
    drawGrid();
    const selectedMap = maps.find(map => map._id === selectedMapId);
    renderTerrain(selectedMap);
  });

  // Initial grid drawing
  drawGrid();

  // Fetch maps and render the first one by default
  fetch('/api/maps')
    .then(response => response.json())
    .then(fetchedMaps => {
      maps = fetchedMaps;
      maps.forEach(map => {
        const option = document.createElement('option');
        option.value = map._id;
        option.textContent = map.name;
        document.getElementById('map-selection').appendChild(option);
      });
      if (maps.length > 0) {
        renderTerrain(maps[0]);  // Render the first map by default
      }
    })
    .catch(error => {
      console.error('Error fetching maps:', error.message);
      console.error(error.stack);
    });
});