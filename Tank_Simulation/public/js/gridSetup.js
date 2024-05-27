import { drawGrid } from './drawGrid.js';
import { createTankPositionDiv } from './tankPositionHelper.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('battlefield-canvas');
  const ctx = canvas.getContext('2d');
  const gridSize = 20; // Size of each grid cell
  let selectedTankSide = null;
  let selectedTankId = null;

  // Function to draw a tank on the grid
  function drawTank(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
  }

  // Event listener to place tanks on the grid
  canvas.addEventListener('click', (event) => {
    if (!selectedTankSide || !selectedTankId) {
      alert('Please select a tank and side before placing it on the grid.');
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / gridSize);
    const y = Math.floor((event.clientY - rect.top) / gridSize);

    const tankPositionDiv = createTankPositionDiv(selectedTankSide, selectedTankId, x, y);
    document.getElementById('tank-positioning').appendChild(tankPositionDiv);

    // Draw the tank on the grid
    drawTank(x, y, selectedTankSide === 'allies' ? 'green' : 'red');

    // Reset selection
    selectedTankSide = null;
    selectedTankId = null;
  });

  // Initial grid drawing
  drawGrid(ctx, canvas, gridSize);
});