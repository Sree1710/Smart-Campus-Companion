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
        let query = { class: req.params.classId };

        if (req.query.date) {
            query.date = {
                $gte: new Date(new Date(req.query.date).setHours(0, 0, 0)),
                $lt: new Date(new Date(req.query.date).setHours(23, 59, 59))
            };
        }

        const attendance = await Attendance.find(query)
            .populate('subject', 'name')
            .populate('records.student', 'name studentDetails'); // Populate student details for UI

        // If filtering by date, we might want to flatten the structure if multiple subjects?
        // But for "View Class Attendance", returning the docs (one per subject) is fine.
        // Frontend will map over them.

        // If we want a flattened list of "Student | Status (Sub1) | Status (Sub2)", that's complex UI.
        // For now, returning the raw attendance docs is sufficient for the requested "View" capability.
        // However, the ViewAttendance.jsx I wrote expects a flat list of records?
        // No, it maps `attendanceData`.
        // Let's look at ViewAttendance.jsx logic again.
        // It maps `attendanceData` -> `record`. and accesses `record.student?.name`.
        // BUT `data` from backend (Attendance Model) is `[{ records: [ {student, status}, ... ] }]`.
        // My `ViewAttendance.jsx` is assuming a flat list of logic like "Student 1 - Present".
        // Actually, if we view by date, we get multiple Docs (one for each subject).
        // My frontend implementation should probably handle this structure.

        // Let's flatten the response for the frontend "View by Date" use case?
        // OR update the frontend to handle the nested structure.
        // Let's update backend to return what frontend expects? 
        // Iterate through docs, and collect all student statuses?

        // Simpler: Return the docs. Let frontend display "Subject: Math -> Table of students".
        // But my frontend `ViewAttendance.jsx` table columns are: Student, Status, Remarks, Subject.
        // It iterates `attendanceData.map`.
        // If `attendanceData` is `[ { subject:..., records: [...] } ]`, then mapping it directly won't work as expected if I want one row per student per subject.
        // Effectively I need to "unwind" the records.

        let flatRecords = [];
        if (req.query.date) {
            attendance.forEach(doc => {
                doc.records.forEach(rec => {
                    flatRecords.push({
                        _id: rec._id,
                        student: rec.student,
                        status: rec.status,
                        remarks: rec.remarks,
                        subject: doc.subject
                    });
                });
            });
            return res.status(200).json({ success: true, data: flatRecords });
        }

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
