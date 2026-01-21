const Class = require('../models/Class');
const Subject = require('../models/Subject');
const User = require('../models/User');

// @desc    Get All Classes (Admin/Teacher)
// @route   GET /api/academic/classes
exports.getClasses = async (req, res, next) => {
    try {
        // In a real app, filter classes assigned to teacher.
        // For now, return all classes.
        const classes = await Class.find();
        res.status(200).json({ success: true, data: classes });
    } catch (err) {
        next(err);
    }
};

// @desc    Get Students of a Class
// @route   GET /api/academic/classes/:id/students
exports.getClassStudents = async (req, res, next) => {
    try {
        const classObj = await Class.findById(req.params.id).populate('students', 'name email studentDetails');
        if (!classObj) return res.status(404).json({ success: false, message: 'Class not found' });

        res.status(200).json({ success: true, data: classObj.students });
    } catch (err) {
        next(err);
    }
};

// @desc    Get Subjects (Teacher)
// @route   GET /api/academic/subjects
exports.getSubjects = async (req, res, next) => {
    try {
        // Return all or filter by teacher
        const subjects = await Subject.find({ teacher: req.user.id }).populate('class', 'name');
        // Fallback if no subjects assigned, return all for testing
        if (subjects.length === 0) {
            const all = await Subject.find().populate('class', 'name');
            return res.status(200).json({ success: true, data: all });
        }
        res.status(200).json({ success: true, data: subjects });
    } catch (err) {
        next(err);
    }
};

// @desc    Create Class (Admin - Helper)
exports.createClass = async (req, res, next) => {
    try {
        const newClass = await Class.create(req.body);
        res.status(201).json({ success: true, data: newClass });
    } catch (err) { next(err); }
};

// @desc    Assign Student to Class (Admin - Helper)
exports.assignStudent = async (req, res, next) => {
    try {
        const { studentId, classId } = req.body;
        const cls = await Class.findById(classId);
        if (!cls.students.includes(studentId)) {
            cls.students.push(studentId);
            await cls.save();
        }
        res.status(200).json({ success: true, data: cls });
    } catch (err) { next(err); }
};
