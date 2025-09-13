const mongoose = require('mongoose');

const fixedpackagesSchema = new mongoose.Schema({
    id: Number,
    package_title: String,
    package_short_desc:String,
    price: Number,
    desc: String,
    img: String,
    package_includes: [String],
    faqs:[Object]
});

// Add indexes for better query performance
fixedpackagesSchema.index({ package_title: 1 });
fixedpackagesSchema.index({ price: 1 });

module.exports = mongoose.model('fixedsurgicalpackages', fixedpackagesSchema);