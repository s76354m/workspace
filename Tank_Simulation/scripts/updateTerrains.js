require('dotenv').config();
const mongoose = require('mongoose');
const Terrain = require('../models/Terrain');

async function updateTerrains() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const terrains = await Terrain.find({});
    console.log(`Found ${terrains.length} terrain records`);

    const updatePromises = terrains.map(async (terrain) => {
      if (terrain.x === undefined || terrain.y === undefined || terrain.z === undefined) {
        console.log(`Updating terrain with ID: ${terrain._id}`);
        terrain.x = terrain.x !== undefined ? terrain.x : 0;
        terrain.y = terrain.y !== undefined ? terrain.y : 0;
        terrain.z = terrain.z !== undefined ? terrain.z : 0;
        await terrain.save();
        console.log(`Terrain with ID: ${terrain._id} updated successfully`);
      }
    });

    await Promise.all(updatePromises);
    console.log('All terrain records updated successfully');

    mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error updating terrain data:', error.message);
    console.error(error.stack);
    mongoose.connection.close();
  }
}

updateTerrains();