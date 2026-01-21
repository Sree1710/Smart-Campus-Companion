const Note = require('../models/Note');

// @desc    Get My Notes
// @route   GET /api/notes
// @access  Student
exports.getNotes = async (req, res, next) => {
    try {
        const notes = await Note.find({ student: req.user.id }).sort({ isPinned: -1, updatedAt: -1 });
        res.status(200).json({ success: true, data: notes });
    } catch (err) {
        next(err);
    }
};

// @desc    Create Note
// @route   POST /api/notes
// @access  Student
exports.createNote = async (req, res, next) => {
    try {
        const { title, content, tags, color, isPinned } = req.body;
        const note = await Note.create({
            student: req.user.id,
            title,
            content,
            tags,
            color,
            isPinned
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
