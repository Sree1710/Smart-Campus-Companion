const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    records: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'OnDuty', 'Late'],
            default: 'Absent',
        },
        remarks: String,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Compound index to ensure one attendance record per subject per class per date (if needed)
// AttendanceSchema.index({ date: 1, subject: 1, class: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
