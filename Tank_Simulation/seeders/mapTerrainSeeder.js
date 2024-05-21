require('dotenv').config();
const mongoose = require('mongoose');
const Terrain = require('../models/Terrain');
const Map = require('../models/Map');

const terrains = [
  { type: 'forest', movementEffect: 0.5, combatEffect: 0.8, x: 1, y: 0, z: 1 },
  { type: 'hill', movementEffect: 0.7, combatEffect: 1.2, x: 2, y: 0, z: 2 },
  { type: 'city', movementEffect: 0.6, combatEffect: 1.0, x: 3, y: 0, z: 3 },
  { type: 'plain', movementEffect: 1.0, combatEffect: 1.0, x: 4, y: 0, z: 4 }
];

const maps = [
  { name: 'Battlefield', terrains: [] },
  { name: 'Urban Warfare', terrains: [] },
  { name: 'Hillside Conflict', terrains: [] }
];

async function seedMapsAndTerrains() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    await Terrain.deleteMany({});
    await Map.deleteMany({});
    console.log('Cleared existing terrain and map data');

    const createdTerrains = await Terrain.insertMany(terrains);
    console.log('Seeded terrain data successfully');

    maps[0].terrains = [createdTerrains[0]._id, createdTerrains[3]._id];
    maps[1].terrains = [createdTerrains[2]._id];
    maps[2].terrains = [createdTerrains[1]._id, createdTerrains[3]._id];

    await Map.insertMany(maps);
    console.log('Seeded map data successfully');

    mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding map and terrain data:', error.message);
    console.error(error.stack);
    mongoose.connection.close();
  }
}

seedMapsAndTerrains();