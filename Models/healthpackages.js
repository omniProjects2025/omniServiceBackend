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

module.exports = mongoose.model('healthpackages', healthpackagesSchema);