const Notice = require('../models/Notice');

// @desc    Get All Notices
// @route   GET /api/notices
// @access  Private (All roles)
exports.getNotices = async (req, res, next) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 }).populate('postedBy', 'name role');
        res.status(200).json({ success: true, data: notices });
    } catch (err) {
        next(err);
    }
};

// @desc    Create Notice
// @route   POST /api/notices
// @access  Teacher, Admin
exports.createNotice = async (req, res, next) => {
    try {
        const { title, content, category } = req.body;

        const notice = await Notice.create({
            title,
            content,
            category,
            postedBy: req.user.id
        });

        // TODO: Send Real-time Notification via Socket.io

        res.status(201).json({ success: true, data: notice });
    } catch (err) {
        next(err);
    }
};
