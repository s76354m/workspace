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
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length === 2;
      },
      message: 'Coordinates must be an array of two numbers [x, y]'
    }
  }
}, {
  timestamps: true
});

const Terrain = mongoose.model('Terrain', terrainSchema);

module.exports = Terrain;