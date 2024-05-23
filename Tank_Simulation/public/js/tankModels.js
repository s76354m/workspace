const THREE = require('three');
const { GLTFLoader } = require('three/examples/jsm/loaders/GLTFLoader');

const tankModels = {};

function getTankModel(tankType, callback) {
  if (tankModels[tankType]) {
    console.log(`Model for tank type ${tankType} already loaded.`);
    callback(null, tankModels[tankType]);
  } else {
    console.log(`Loading model for tank type ${tankType}...`);
    const loader = new GLTFLoader();
    const modelPath = `/models/${tankType}.gltf`;

    loader.load(
      modelPath,
      (gltf) => {
        tankModels[tankType] = gltf.scene;
        console.log(`Loaded model for tank type: ${tankType}`);
        callback(null, gltf.scene);
      },
      undefined,
      (error) => {
        console.error(`Error loading model for tank type: ${tankType}`, error.message);
        console.error(error.stack);
        callback(error, null);
      }
    );
  }
}

function addTankToScene(scene, tankType, isAllies, callback) {
  getTankModel(tankType, (error, tankModel) => {
    if (error) {
      console.error(`Error adding tank to scene: ${error.message}`);
      console.error(error.stack);
      callback(error, null);
      return;
    }
    const tank = tankModel.clone();
    tank.userData = { isAllies };
    scene.add(tank);
    console.log(`Tank of type ${tankType} added to scene.`);
    callback(null, tank);
  });
}

module.exports = {
  getTankModel,
  addTankToScene,
};