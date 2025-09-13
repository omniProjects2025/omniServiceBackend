const mongoose = require('mongoose');

const doctorsSchema = new mongoose.Schema({
  location: String,
  doctors: [{
    name: String,
    profile: String,
    designation: String,
    qualification: [String],
    experience: String,
    bio: [String],
    awards: [String],
    availability: String,
    education: [String],
    area_expertise: [String],
    fellowships: [String],
    publications: String,
    work_location: String,
    department: String,
    specialization: String
  }]
});


doctorsSchema.index({ location: 1});
doctorsSchema.index({ designation: 1 });

module.exports = mongoose.model('doctors', doctorsSchema);