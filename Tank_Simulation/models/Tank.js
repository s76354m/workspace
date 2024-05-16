const mongoose = require('mongoose');

const tankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  frontalArmor: {
    type: Number,
    required: true
  },
  sideArmor: {
    type: Number,
    required: true
  },
  mainGunSize: {
    type: Number,
    required: true
  },
  mainGunPenetration: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

tankSchema.pre('save', function(next) {
  console.log(`Saving tank: ${this.name}`);
  next();
});

tankSchema.post('save', function(doc, next) {
  console.log(`Tank ${doc.name} saved successfully`);
  next();
});

tankSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else if (error) {
    console.error(`Error saving the tank: ${error.message}`, error.stack);
    next(error);
  } else {
    next();
  }
});

const Tank = mongoose.model('Tank', tankSchema);

module.exports = Tank;