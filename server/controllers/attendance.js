const Attendance = require('../models/Attendance');
const Class = require('../models/Class');
const DutyLeave = require('../models/DutyLeave');

// @desc    Mark Attendance
// @route   POST /api/attendance
// @access  Teacher
exports.markAttendance = async (req, res, next) => {
    try {
        const { date, subject, classId, records } = req.body;

        // Check if attendance already exists for this subject/date/class
        // Note: Date passing from frontend should be normalized (e.g. set to midnight)
        // For simplicity, we assume one entry per day per subject.

        let attendance = await Attendance.findOne({
            subject,
            class: classId,
            date: {
                $gte: new Date(new Date(date).setHours(0, 0, 0)),
                $lt: new Date(new Date(date).setHours(23, 59, 59))
            }
        });

        if (attendance) {
            // Update existing
            attendance.records = records;
            await attendance.save();
        } else {
            // Create new
            attendance = await Attendance.create({
                date,
                subject,
                class: classId,
                teacher: req.user.id,
                records
            });
        }

        res.status(200).json({ success: true, data: attendance });
    } catch (err) {
        next(err);
    }
};

// @desc    Get Attendance for a Class (Teacher/Admin view)
// @route   GET /api/attendance/class/:classId
// @access  Teacher, Admin
exports.getClassAttendance = async (req, res, next) => {
    try {
        const attendance = await Attendance.find({ class: req.params.classId })
            .populate('subject', 'name')
            .populate('records.student', 'name email');

        res.status(200).json({ success: true, data: attendance });
    } catch (err) {
        next(err);
    }
};

// @desc    Get Student Attendance (Student view)
// @route   GET /api/attendance/my
// @access  Student
exports.getMyAttendance = async (req, res, next) => {
    try {
        // Find all attendance records where the student is present in the records array
        const attendance = await Attendance.find({
            "records.student": req.user.id
        })
            .populate('subject', 'name code')
            .sort({ date: -1 });

        // Filter out only the record for this student to simplify frontend (optional)
        const formatted = attendance.map(doc => {
            const myRecord = doc.records.find(r => r.student.toString() === req.user.id.toString());
            return {
                _id: doc._id,
                date: doc.date,
                subject: doc.subject,
                status: myRecord ? myRecord.status : 'Unknown',
                remarks: myRecord ? myRecord.remarks : ''
            };
        });

        res.status(200).json({ success: true, data: formatted });
    } catch (err) {
        next(err);
    }
};
