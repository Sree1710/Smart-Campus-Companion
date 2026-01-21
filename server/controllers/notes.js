const Note = require('../models/Note');

// @desc    Get Notes (Personal for Students / Assignments for Class for Students / Created for Teachers)
// @route   GET /api/notes
// @access  Private
exports.getNotes = async (req, res, next) => {
    try {
        let query = {};

        if (req.user.role === 'student') {
            // Student sees:
            // 1. Their own personal notes.
            // 2. notes/assignments posted for their Class.
            // We need to find the student's class first.
            // Assuming student details are embedded or we look it up.
            // Ideally User model has 'studentDetails.class' but wait, Class model has 'students' array.
            // Let's stick to: Personal notes for now OR finding Class via reverse lookup.
            // But wait, to be efficient, let's look up Class first.

            const ClassModel = require('../models/Class');
            // Find class where students array contains user.id
            const studentClass = await ClassModel.findOne({ students: req.user.id });

            const orConditions = [{ student: req.user.id }]; // Personal notes

            if (studentClass) {
                // Add class assignments/notes
                orConditions.push({
                    class: studentClass._id,
                    type: { $in: ['assignment', 'lecture_note'] }
                });
            }

            query = { $or: orConditions };

        } else if (req.user.role === 'teacher') {
            // Teacher sees notes they created (Assignments/Lecture Notes)
            query = { student: req.user.id };
            // Note: 'student' field in Schema is effectively 'creator'
        } else {
            // Admin? Maybe custom logic or just see own personal notes if feature enabled.
            query = { student: req.user.id };
        }

        const notes = await Note.find(query)
            .populate('subject', 'name') // Populate subject for assignments
            .populate('student', 'name') // Show creator name (Teacher)
            .sort({ isPinned: -1, updatedAt: -1 });

        res.status(200).json({ success: true, data: notes });
    } catch (err) {
        next(err);
    }
};

// @desc    Create Note
// @route   POST /api/notes
// @access  Private
exports.createNote = async (req, res, next) => {
    try {
        const { title, content, tags, color, isPinned, type, classId, subjectId, dueDate } = req.body;

        // Validation for Teacher types
        if (req.user.role === 'teacher') {
            // Teachers typically create assignments/lecture notes
            // If they modify existing personal note logic, ensure type is handled.
        }

        const note = await Note.create({
            student: req.user.id, // Creator
            title,
            content,
            tags,
            color,
            isPinned,
            type: type || 'personal',
            class: classId,
            subject: subjectId,
            dueDate
        });
        res.status(201).json({ success: true, data: note });
    } catch (err) {
        next(err);
    }
};

// @desc    Update Note
// @route   PUT /api/notes/:id
// @access  Student
exports.updateNote = async (req, res, next) => {
    try {
        let note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
        if (note.student.toString() !== req.user.id) return res.status(401).json({ success: false, message: 'Not authorized' });

        note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: note });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete Note
// @route   DELETE /api/notes/:id
// @access  Student
exports.deleteNote = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
        if (note.student.toString() !== req.user.id) return res.status(401).json({ success: false, message: 'Not authorized' });

        await note.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
