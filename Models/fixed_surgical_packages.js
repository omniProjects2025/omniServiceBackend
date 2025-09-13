const mongoose = require('mongoose');

const fixedpackagesSchema = new mongoose.Schema({
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
  package_short_desc: {
    type: String,
    trim: true,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  desc: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  img: {
    type: String,
    trim: true
  },
  package_includes: [{
    type: String,
    trim: true
  }],
  faqs: [{
    question: String,
    answer: String
  }]
}, {
  timestamps: true
});

// Indexes for better performance
fixedpackagesSchema.index({ package_title: 1 });
fixedpackagesSchema.index({ price: 1 });
fixedpackagesSchema.index({ package_short_desc: 1 });
fixedpackagesSchema.index({ createdAt: -1 });

module.exports = mongoose.model('FixedSurgicalPackage', fixedpackagesSchema);