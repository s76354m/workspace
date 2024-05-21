const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const terrainSchema = new Schema({
  type: {
    type: String,
    required: true,
    trim: true,
    enum: ['forest', 'hill', 'city', 'plain']
  },
  movementEffect: {
    type: Number,
    required: true,
    min: 0
  },
  combatEffect: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

const Terrain = mongoose.model('Terrain', terrainSchema);

module.exports = Terrain;