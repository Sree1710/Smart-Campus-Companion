const DutyLeave = require('../models/DutyLeave');
const Attendance = require('../models/Attendance');

// @desc    Apply for Duty Leave
// @route   POST /api/od
// @access  Student
exports.applyDutyLeave = async (req, res, next) => {
    try {
        const { title, type, fromDate, toDate, reason, proofUrl } = req.body;

        const od = await DutyLeave.create({
            student: req.user.id,
            title,
            description: reason,
            type,
            fromDate,
            toDate,
            proofUrl
        });

        res.status(201).json({ success: true, data: od });
    } catch (err) {
        next(err);
    }
};

// @desc    Get My OD Requests
// @route   GET /api/od/my
// @access  Student
exports.getMyDutyLeaves = async (req, res, next) => {
    try {
        const ods = await DutyLeave.find({ student: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: ods });
    } catch (err) {
        next(err);
    }
};

// @desc    Get Pending OD Requests (Teacher)
// @route   GET /api/od/pending
// @access  Teacher, Admin
exports.getPendingDutyLeaves = async (req, res, next) => {
    try {
        // Ideally filter by class teacher, but for now return all or filter by query
        const ods = await DutyLeave.find({ status: 'Pending' })
            .populate('student', 'name studentDetails');
        res.status(200).json({ success: true, data: ods });
    } catch (err) {
        next(err);
    }
};

// @desc    Update OD Status (Approve/Reject)
// @route   PUT /api/od/:id
// @access  Teacher
exports.updateDutyLeaveStatus = async (req, res, next) => {
    try {
        const { status, remarks } = req.body; // status: 'Approved' or 'Rejected'

        let od = await DutyLeave.findById(req.params.id);

        if (!od) {
            return res.status(404).json({ success: false, message: 'OD not found' });
        }

        od.status = status;
        od.teacherRemarks = remarks;
        od.approvedBy = req.user.id;
        await od.save();

        // If approved, update attendance?
        // This is complex because attendance might not exist yet for future dates.
        // Or if it exists, we overwrite.
        // Strategy: When marking attendance, teacher sees OD status.
        // OR: We define a Background Job or Hook. 
        // Simple MVP: Just mark OD status. Attendance Marking API should check for Approved ODs.

        // However, if attendance ALREADY exists for those dates:
        if (status === 'Approved') {
            const start = new Date(od.fromDate);
            const end = new Date(od.toDate);

            // Find attendance between these dates where student is recorded
            // Update their status to 'OnDuty'
            // This handles "retroactive" approval updating existing records.
            // For future records, the `markAttendance` UI should fetch ODs.
            await Attendance.updateMany(
                {
                    date: { $gte: start, $lte: end },
                    "records.student": od.student
                },
                {
                    $set: { "records.$.status": "OnDuty", "records.$.remarks": `OD: ${od.title}` }
                }
            );
        }

        res.status(200).json({ success: true, data: od });
    } catch (err) {
        next(err);
    }
};
