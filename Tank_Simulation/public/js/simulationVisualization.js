const THREE = require('three');
const { getTankModel } = require('./tankModels');

let scene, camera, renderer;
let alliesTanks = [];
let axisTanks = [];

function initSimulation(container) {
  try {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    camera.position.z = 10;

    function animate() {
      requestAnimationFrame(animate);

      // Update tank positions based on simulation logic
      updateTankPositions();

      renderer.render(scene, camera);
    }
    animate();

    console.log('Simulation scene initialized successfully');
  } catch (error) {
    console.error('Error initializing simulation scene:', error.message);
    console.error(error.stack);
  }
}

function loadTanks(tankIds, isAllies) {
  try {
    tankIds.forEach(tankId => {
      getTankModel(tankId, (error, tankModel) => {
        if (error) {
          console.error('Error loading tank model:', error.message);
          console.error(error.stack);
          return;
        }
        const tank = tankModel.clone();
        if (isAllies) {
          alliesTanks.push(tank);
        } else {
          axisTanks.push(tank);
        }
        scene.add(tank);
      });
    });
  } catch (error) {
    console.error('Error loading tanks:', error.message);
    console.error(error.stack);
  }
}

function updateTankPositions() {
  try {
    // Example logic for moving tanks forward
    alliesTanks.forEach(tank => {
      tank.position.x += 0.01;
    });

    axisTanks.forEach(tank => {
      tank.position.x -= 0.01;
    });
  } catch (error) {
    console.error('Error updating tank positions:', error.message);
    console.error(error.stack);
  }
}

function startSimulation(container, alliesTankIds, axisTankIds) {
  try {
    initSimulation(container);
    loadTanks(alliesTankIds, true);
    loadTanks(axisTankIds, false);
    console.log('Simulation started');
  } catch (error) {
    console.error('Error starting simulation:', error.message);
    console.error(error.stack);
  }
}

module.exports = {
  startSimulation,
};