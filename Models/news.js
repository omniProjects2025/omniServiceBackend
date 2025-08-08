const mongoose = require('mongoose');

const descriptionMixed = {
    type: mongoose.Schema.Types.Mixed,
    required: true
};

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    short_desc: {
        type: String,
        required: true
    },
    description: descriptionMixed,
    image: {
        type: String,
        required: false
    },
    imageAlt: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { collection: 'news' });
module.exports = mongoose.model('News', newsSchema);