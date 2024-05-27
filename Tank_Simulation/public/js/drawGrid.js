export const drawGrid = (ctx, canvas, gridSize) => {
  const rows = canvas.height / gridSize;
  const cols = canvas.width / gridSize;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#ccc';
  for (let i = 0; i <= cols; i++) {
    ctx.beginPath();
    ctx.moveTo(i * gridSize, 0);
    ctx.lineTo(i * gridSize, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i <= rows; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * gridSize);
    ctx.lineTo(canvas.width, i * gridSize);
    ctx.stroke();
  }
};