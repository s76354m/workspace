require('dotenv').config();
const mongoose = require('mongoose');
const Terrain = require('../models/Terrain');
const Map = require('../models/Map');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.log('Failed to connect to MongoDB', err.message);
    console.error(err);
  });

const terrains = [
  { type: 'forest', movementPenalty: 1.5, combatEffect: 0.8 },
  { type: 'hill', movementPenalty: 1.2, combatEffect: 1.1 },
  { type: 'city', movementPenalty: 1, combatEffect: 1 }
];

const mapData = [
  { name: 'Generic Battlefield', terrains: [] }
];

async function seedDB() {
  try {
    await Terrain.deleteMany({});
    console.log('Terrains collection cleared');
    await Map.deleteMany({});
    console.log('Maps collection cleared');

    const savedTerrains = await Terrain.insertMany(terrains);
    console.log('Terrains inserted:', savedTerrains.map(t => t.type));

    const terrainIds = savedTerrains.map(t => t._id);
    mapData.forEach(map => map.terrains = terrainIds);
    await Map.insertMany(mapData);
    console.log('Maps inserted:', mapData.map(m => m.name));

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding the database:', error.message);
    console.error(error.stack);
  } finally {
    mongoose.connection.close();
  }
}

seedDB().catch(err => {
  console.error('Unhandled error in seedDB:', err.message);
  console.error(err.stack);
});