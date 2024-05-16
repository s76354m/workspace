const mongoose = require('mongoose');

const terrainSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true
  },
  movementPenalty: {
    type: Number,
    required: true
  },
  combatEffect: {
    type: Number,
    required: true
  }
});

terrainSchema.pre('save', function(next) {
  console.log(`Saving terrain: ${this.type}`);
  next();
});

terrainSchema.post('save', function(doc, next) {
  console.log(`Terrain ${doc.type} saved successfully`);
  next();
});

terrainSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    console.error(`There was a duplicate key error for terrain: ${doc.type}`, error.stack);
    next(new Error('There was a duplicate key error'));
  } else if (error) {
    console.error(`Error saving the terrain: ${error.message}`, error.stack);
    next(error);
  } else {
    next();
  }
});

const Terrain = mongoose.model('Terrain', terrainSchema);

module.exports = Terrain;