require('dotenv').config();
const mongoose = require('mongoose');
const Tank = require('../models/Tank');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected successfully'))
  .catch(err => {
    console.log(`Database connection error: ${err.message}`);
    console.error(err);
  });

const tanks = [
  { name: 'Tiger I', frontalArmor: 100, sideArmor: 80, mainGunSize: 88, mainGunPenetration: 100 },
  { name: 'T-34', frontalArmor: 45, sideArmor: 40, mainGunSize: 76, mainGunPenetration: 92 },
  // Add more tanks as needed
];

Tank.insertMany(tanks)
  .then(() => {
    console.log('Successfully seeded tanks to the database');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error seeding tanks to the database', err);
    mongoose.connection.close();
  });