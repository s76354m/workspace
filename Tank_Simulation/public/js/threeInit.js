const THREE = require('three');

export function addTerrainToScene(scene, terrainType, x, y, z) {
  if ([x, y, z].some(coord => coord === undefined || isNaN(coord))) {
    console.error(`Invalid coordinates for terrain: x=${x}, y=${y}, z=${z}`);
    return; // Skip adding this terrain
  }
  let color;
  switch (terrainType) {
    case 'forest':
      color = 0x228B22; // Forest green
      break;
    case 'hill':
      color = 0x8B4513; // Saddle brown
      break;
    case 'city':
      color = 0x808080; // Gray
      break;
    case 'plain':
      color = 0xFFFF00; // Yellow
      break;
    default:
      color = 0xFFFFFF; // Default white
  }

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y, z);
  scene.add(cube);
}

export function addTankToScene(scene, x, y, z) {
  if (x === undefined || y === undefined || z === undefined) {
    throw new Error('Coordinates are undefined');
  }
  const geometry = new THREE.BoxGeometry(1, 1, 2); // Simple tank representation
  const material = new THREE.MeshBasicMaterial({ color: 0x0000FF }); // Blue for tanks
  const tank = new THREE.Mesh(geometry, material);
  tank.position.set(x, y, z);
  scene.add(tank);
  return tank;
}

export function addTanksToScene(scene, tanksData) {
  return tanksData.map(tank => {
    return addTankToScene(scene, tank.x, tank.y, tank.z);
  });
}