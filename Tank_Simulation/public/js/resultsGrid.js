import { drawGrid } from './drawGrid.js';

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('results-canvas');
  const ctx = canvas.getContext('2d');

  const gridSize = 20; // Size of each cell in the grid

  function drawTank(tank, color) {
    if (typeof tank.x === 'undefined' || typeof tank.y === 'undefined') {
      console.error('Invalid tank position:', tank);
      return;
    }
    ctx.fillStyle = color;
    ctx.fillRect(tank.x * gridSize, tank.y * gridSize, gridSize, gridSize);
  }

  function renderResults(outcome) {
    drawGrid(ctx, canvas, gridSize);
    outcome.allies.tanks.forEach(tank => drawTank(tank, tank.outcome === 'survived' ? 'green' : 'red'));
    outcome.axis.tanks.forEach(tank => drawTank(tank, 'red'));
  }

  // Fetch simulation outcome data from the server
  fetch('/api/simulation-outcome')
    .then(response => response.json())
    .then(data => {
      console.log('Fetched simulation outcome data:', data);
      if (data && data.outcome) {
        renderResults(data.outcome);
      } else {
        console.error('Invalid simulation outcome data:', data);
      }
    })
    .catch(error => {
      console.error('Error fetching simulation outcome:', error.message);
      console.error(error.stack);
    });

  // Initial render
  drawGrid(ctx, canvas, gridSize);
});