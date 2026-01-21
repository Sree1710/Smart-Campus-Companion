const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public (for now, or Admin only later)
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    let user = null;
    try {
        const { name, email, password, role, studentDetails, teacherDetails,
            // New fields for auto-wiring
            className, subjectName, subjectCode, rollNumber
        } = req.body;

        // Normalize Class Name (Trim + Uppercase) to prevent "mca", "MCA ", "mca" mismatch
        const normalizedClassName = className ? className.trim().toUpperCase() : null;

        // 1. Validation
        if (role === 'student') {
            if (!normalizedClassName || !rollNumber) {
                return res.status(400).json({ success: false, message: 'Class Name and Roll Number are required for Students' });
            }
        }
        if (role === 'teacher') {
            if (!normalizedClassName || !subjectName || !subjectCode) {
                return res.status(400).json({ success: false, message: 'Class Name, Subject Name, and Subject Code are required for Teachers' });
            }
        }

        // 2. Create user
        user = await User.create({
            name,
            email,
            password,
            role,
            studentDetails: role === 'student' ? { ...studentDetails, rollNumber } : undefined,
            teacherDetails
        });

        // 3. Auto-Wiring Logic
        if (normalizedClassName) {
            const Class = require('../models/Class');
            const Subject = require('../models/Subject');

            // Find or Create Class
            // Validation: Batch is required in Class model, defaulting here if not provided or asking user?
            // For simplicity, we default batch to current year if creating new.
            let classObj = await Class.findOne({ name: normalizedClassName });
            if (!classObj) {
                const currentYear = new Date().getFullYear();
                classObj = await Class.create({
                    name: normalizedClassName,
                    batch: `${currentYear}-${currentYear + 4}`,
                    students: []
                });
            }

            // Handle Student Assignment
            if (role === 'student') {
                if (!classObj.students.includes(user._id)) {
                    classObj.students.push(user._id);
                    await classObj.save();
                }
            }

            // Handle Teacher Subject Creation
            if (role === 'teacher') {
                await Subject.create({
                    name: subjectName,
                    code: subjectCode,
                    class: classObj._id,
                    teacher: user._id
                });
            }
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        // Rollback: Delete user if created but error occurred
        if (user) {
            await User.findByIdAndDelete(user._id);
        }

        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        next(err);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        next(err);
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        // .cookie('token', token, options) // Optional: if using cookies
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
};
