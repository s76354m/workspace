const mongoose = require('mongoose');
const Terrain = require('./Terrain');

const terrainLayoutSchema = new mongoose.Schema({
  terrain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Terrain',
    required: true
  },
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  }
}, { _id: false });

const mapSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  terrains: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Terrain'
  }],
  terrainLayouts: [terrainLayoutSchema]
});

mapSchema.pre('save', function(next) {
  console.log(`Saving map: ${this.name}`);
  if (!this.terrainLayouts || this.terrainLayouts.length === 0) {
    console.warn(`Map ${this.name} has no terrain layouts defined.`);
  }
  next();
});

mapSchema.post('save', function(doc, next) {
  console.log(`Map ${doc.name} saved successfully with ${doc.terrainLayouts.length} terrain layouts.`);
  next();
});

mapSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    console.error(`There was a duplicate key error for map: ${doc.name}`, error.stack);
    next(new Error('There was a duplicate key error'));
  } else if (error) {
    console.error(`Error saving the map: ${error.message}`, error.stack);
    next(error);
  } else {
    next();
  }
});

const Map = mongoose.model('Map', mapSchema);

module.exports = Map;