const THREE = require('three');

export function initThreeScene(container) {
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    camera.position.z = 5;

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    console.log('Three.js scene initialized successfully');
    return { scene, camera, renderer };
  } catch (error) {
    console.error('Error initializing Three.js scene:', error.message);
    console.error(error.stack);
  }
}

export function addTerrainToScene(scene, terrainType, x, y, z) {
  try {
    if (typeof x === 'undefined' || typeof y === 'undefined' || typeof z === 'undefined') {
      console.error('Terrain data missing coordinates property');
      return;
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

    console.log(`Terrain of type ${terrainType} added to scene at (${x}, ${y}, ${z})`);
  } catch (error) {
    console.error('Error adding terrain to scene:', error.message);
    console.error(error.stack);
  }
}

export function updateTankPosition(tank, x, y, z) {
  try {
    tank.position.set(x, y, z);
    console.log(`Tank position updated to (${x}, ${y}, ${z})`);
  } catch (error) {
    console.error('Error updating tank position:', error.message);
    console.error(error.stack);
  }
}

export function addTankToScene(scene, tankModel, x, y, z) {
  try {
    const tank = tankModel.clone();
    tank.position.set(x, y, z);
    scene.add(tank);
    console.log(`Tank added to scene at (${x}, ${y}, ${z})`);
  } catch (error) {
    console.error('Error adding tank to scene:', error.message);
    console.error(error.stack);
  }
}