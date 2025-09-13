const mongoose = require('mongoose');

const healthpackagesSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  package_title: {
    type: String,
    required: [true, 'Package title is required'],
    trim: true,
    maxlength: [200, 'Package title cannot exceed 200 characters']
  },
  oldPrice: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  newPrice: {
    type: Number,
    required: [true, 'New price is required'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  image: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  faqs: [{
    question: String,
    answer: String
  }],
  package_details: [{
    type: String,
    trim: true
  }],
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  }
}, {
  timestamps: true
});

// Indexes for better performance
healthpackagesSchema.index({ package_title: 1 });
healthpackagesSchema.index({ location: 1 });
healthpackagesSchema.index({ newPrice: 1 });
healthpackagesSchema.index({ discount: 1 });
healthpackagesSchema.index({ createdAt: -1 });

module.exports = mongoose.model('HealthPackage', healthpackagesSchema);