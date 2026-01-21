const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    date: {
        type: Date,
        required: true,
    },
    location: String,
    type: {
        type: String,
        enum: ['Academic', 'Sports', 'Cultural', 'Other'],
        default: 'Academic',
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Event', EventSchema);
