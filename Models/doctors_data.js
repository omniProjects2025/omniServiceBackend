const mongoose = require('mongoose');

const doctorDetailsSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  doctor_name: {
    type: String,
    required: [true, 'Doctor name is required'],
    trim: true,
    maxlength: [100, 'Doctor name cannot exceed 100 characters']
  },
  doctor_profile: {
    type: String,
    trim: true
  },
  doctor_designation: {
    type: String,
    required: [true, 'Doctor designation is required'],
    trim: true,
    maxlength: [100, 'Designation cannot exceed 100 characters']
  },
  doctor_experience: {
    type: String,
    trim: true,
    maxlength: [50, 'Experience cannot exceed 50 characters']
  },
  doctor_qualification: {
    type: String,
    trim: true,
    maxlength: [200, 'Qualification cannot exceed 200 characters']
  },
  doctor_bio: {
    type: String,
    trim: true,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  doctor_awards: {
    type: String,
    trim: true,
    maxlength: [500, 'Awards cannot exceed 500 characters']
  },
  doctor_availability: {
    type: String,
    trim: true,
    maxlength: [200, 'Availability cannot exceed 200 characters']
  },
  location: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes for better performance
doctorDetailsSchema.index({ doctor_name: 1 });
doctorDetailsSchema.index({ doctor_designation: 1 });
doctorDetailsSchema.index({ location: 1 });
doctorDetailsSchema.index({ doctor_experience: 1 });
doctorDetailsSchema.index({ createdAt: -1 });

module.exports = mongoose.model('DoctorData', doctorDetailsSchema);