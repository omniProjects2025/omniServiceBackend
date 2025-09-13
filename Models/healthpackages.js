const mongoose = require('mongoose');

const healthpackagesSchema = new mongoose.Schema({
    id: Number,
    package_title: String,
    oldPrice: Number,
    newPrice: Number,
    description: String,
    image: String,
    location: String,
    faqs:[],
    package_details: [String],
    discount:Number
});

// Add indexes for better query performance
healthpackagesSchema.index({ package_title: 1 });
healthpackagesSchema.index({ location: 1 });
healthpackagesSchema.index({ discount: 1 });

module.exports = mongoose.model('healthpackages', healthpackagesSchema);