const THREE = require('three');
const { getTankModel } = require('../public/js/tankModels');

async function startSimulationVisualization(alliesTanks, axisTanks, map, battleStats) {
  try {
    console.log('Starting simulation visualization...');

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 5;

    // Add map terrains to the scene
    map.terrains.forEach(terrain => {
      if (!terrain.type || typeof terrain.coordinates === 'undefined') {
        console.error('Terrain data missing type or coordinates property');
        return;
      }

      let color;
      switch (terrain.type) {
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
      cube.position.set(terrain.coordinates.x, terrain.coordinates.y, terrain.coordinates.z);
      scene.add(cube);
    });

    // Add tanks to the scene
    alliesTanks.forEach(tankId => getTankModel(tankId, (error, tankModel) => {
      if (error) {
        console.error(`Error adding allies tank to scene: ${error.message}`);
        console.error(error.stack);
        return;
      }
      const tank = tankModel.clone();
      tank.userData = { isAllies: true };
      scene.add(tank);
    }));

    axisTanks.forEach(tankId => getTankModel(tankId, (error, tankModel) => {
      if (error) {
        console.error(`Error adding axis tank to scene: ${error.message}`);
        console.error(error.stack);
        return;
      }
      const tank = tankModel.clone();
      tank.userData = { isAllies: false };
      scene.add(tank);
    }));

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    console.log('Simulation visualization started successfully.');
  } catch (error) {
    console.error('Error in startSimulationVisualization:', error.message);
    console.error(error.stack);
    throw error;
  }
}

module.exports = { startSimulationVisualization };