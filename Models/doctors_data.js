const mongoose = require('mongoose');

const doctorDetailsSchema = new mongoose.Schema({
  id: Number,
  doctor_name: String,
  doctor_profile: String,
  doctor_designation: String,
  doctor_experience: String,
  doctor_qualification: String,
  doctor_bio: String,
  doctor_awards: String,
  doctor_availability: String,
  location: [String]
});

doctorDetailsSchema.index({ location: 1});
doctorDetailsSchema.index({ doctor_designation: 1 });

module.exports = mongoose.model('doctorsData', doctorDetailsSchema);