import { drawGrid, renderTerrain } from './mapUtils.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('battlefield-canvas');
  const context = canvas.getContext('2d');
  const mapSelect = document.getElementById('map-selection');
  const gridSize = 20; // Size of each grid cell
  let maps = []; // Store maps data

  // Initial grid drawing
  drawGrid(context, canvas);

  // Fetch maps and render the first one by default
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
});