const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tankSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  frontalArmor: {
    type: Number,
    required: true,
    min: 0
  },
  sideArmor: {
    type: Number,
    required: true,
    min: 0
  },
  mainGunSize: {
    type: Number,
    required: true,
    min: 0
  },
  mainGunPenetration: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

const Tank = mongoose.model('Tank', tankSchema);

module.exports = Tank;