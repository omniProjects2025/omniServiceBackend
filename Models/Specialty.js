const mongoose = require('mongoose');

const specialtySchema = new mongoose.Schema({
  id: Number,
  name: String,
  icon: String,
  blue_icon: String,
  location: [String]
});

module.exports = mongoose.model('Specialty', specialtySchema);