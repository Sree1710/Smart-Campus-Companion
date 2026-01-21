const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['personal', 'assignment', 'lecture_note'],
        default: 'personal' // 'personal' for students, others for teachers
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class' // Required if type is assignment/lecture_note
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject' // Optional context
    },
    dueDate: Date, // Valid only for assignments
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
