const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a class name'], // e.g. "CSE-A"
        trim: true,
    },
    batch: {
        type: String,
        required: [true, 'Please add a batch year'], // e.g. "2023-2027"
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    // Teachers assigned to this class specifically (optional, maybe inferred from subjects)
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Class', ClassSchema);
