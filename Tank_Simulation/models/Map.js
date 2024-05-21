const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mapSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  terrains: [{
    type: Schema.Types.ObjectId,
    ref: 'Terrain',
    required: true
  }]
}, {
  timestamps: true
});

const Map = mongoose.model('Map', mapSchema);

module.exports = Map;