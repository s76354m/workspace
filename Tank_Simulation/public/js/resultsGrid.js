// Initialize the results grid
function initializeResultsGrid(outcome) {
  const canvas = document.getElementById('results-canvas');
  const ctx = canvas.getContext('2d');

  // Set canvas dimensions
  canvas.width = 800;
  canvas.height = 600;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the grid
  drawGrid(ctx, canvas.width, canvas.height);

  // Render initial tank positions
  renderTanks(ctx, outcome.allies.tanks, 'blue');
  renderTanks(ctx, outcome.axis.tanks, 'red');

  // Animate the simulation results
  animateSimulation(ctx, outcome);
}

// Draw the grid on the canvas
function drawGrid(ctx, width, height) {
  const cellSize = 50;
  const rows = Math.floor(height / cellSize);
  const cols = Math.floor(width / cellSize);

  ctx.strokeStyle = 'lightgrey';
  ctx.lineWidth = 0.5;

  for (let i = 0; i <= rows; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(width, i * cellSize);
    ctx.stroke();
  }

  for (let j = 0; j <= cols; j++) {
    ctx.beginPath();
    ctx.moveTo(j * cellSize, 0);
    ctx.lineTo(j * cellSize, height);
    ctx.stroke();
  }
}

// Render tanks on the grid
function renderTanks(ctx, tanks, color) {
  tanks.forEach(tank => {
    const x = tank.position.x * 50 + 25;
    const y = tank.position.y * 50 + 25;
    const radius = 20;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

// Animate the simulation results
function animateSimulation(ctx, outcome) {
  // TODO: Implement animation logic based on the simulation outcome data
  // Show tank movements, shots fired, and tanks being destroyed
  console.log('Animating simulation results:', outcome);
}