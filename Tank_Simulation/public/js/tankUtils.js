export const drawTankIcon = (context, x, y, side) => {
  const gridSize = 20; // Size of each grid cell
  context.fillStyle = side === 'allies' ? 'blue' : 'red';
  context.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
};