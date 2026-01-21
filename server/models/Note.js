const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: String,
    content: String,
    tags: [String],
    color: {
        type: String,
        default: '#ffffff', // hex color
    },
    isPinned: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Note', NoteSchema);
