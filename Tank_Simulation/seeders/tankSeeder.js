require('dotenv').config();
const mongoose = require('mongoose');
const Tank = require('../models/Tank');

const tanks = [
  {
    name: 'Tiger I',
    frontalArmor: 100,
    sideArmor: 80,
    mainGunSize: 88,
    mainGunPenetration: 200,
  },
  {
    name: 'Sherman',
    frontalArmor: 50,
    sideArmor: 38,
    mainGunSize: 75,
    mainGunPenetration: 100,
  },
  {
    name: 'T-34',
    frontalArmor: 45,
    sideArmor: 40,
    mainGunSize: 76,
    mainGunPenetration: 120,
  },
  {
    name: 'Panther',
    frontalArmor: 80,
    sideArmor: 50,
    mainGunSize: 75,
    mainGunPenetration: 150,
  },
];

async function seedTanks() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    await Tank.deleteMany({});
    console.log('Cleared existing tank data');

    await Tank.insertMany(tanks);
    console.log('Seeded tank data successfully');

    mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding tank data:', error.message);
    console.error(error.stack);
    mongoose.connection.close();
  }
}

seedTanks();