const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { markAttendance, getClassAttendance, getMyAttendance } = require('../controllers/attendance');
const { applyDutyLeave, getMyDutyLeaves, getPendingDutyLeaves, updateDutyLeaveStatus } = require('../controllers/dutyLeave');
const { getNotices, createNotice } = require('../controllers/notices');
const { getNotes, createNote, updateNote, deleteNote } = require('../controllers/notes');
const { updateBusLocation, getLiveBusLocations } = require('../controllers/bus');
const { getClasses, getClassStudents, getSubjects, createClass, assignStudent } = require('../controllers/academic');

const router = express.Router();

// Attendance Helper Route (Mount at /api/attendance)
const attendanceRouter = express.Router();
attendanceRouter.use(protect);
attendanceRouter.post('/', authorize('teacher', 'admin'), markAttendance);
attendanceRouter.get('/class/:classId', authorize('teacher', 'admin'), getClassAttendance);
attendanceRouter.get('/my', authorize('student'), getMyAttendance);

// Duty Leave Helper Route (Mount at /api/od)
const odRouter = express.Router();
odRouter.use(protect);
odRouter.post('/', authorize('student'), applyDutyLeave);
odRouter.get('/my', authorize('student'), getMyDutyLeaves);
odRouter.get('/pending', authorize('teacher', 'admin'), getPendingDutyLeaves);
odRouter.put('/:id', authorize('teacher', 'admin'), updateDutyLeaveStatus);

// Notices Route
const noticeRouter = express.Router();
noticeRouter.use(protect);
noticeRouter.get('/', getNotices);
noticeRouter.post('/', authorize('teacher', 'admin'), createNotice);

// Notes Route
const noteRouter = express.Router();
noteRouter.use(protect);
noteRouter.use(authorize('student')); // All note routes are student only
noteRouter.get('/', getNotes);
noteRouter.post('/', createNote);
noteRouter.put('/:id', updateNote);
noteRouter.delete('/:id', deleteNote);

// Bus Route
const busRouter = express.Router();
// Special case: location update might be from a device without user token, but we'll use a simple approach for now
// or allow public if deviceId is present (handled in controller)
busRouter.post('/location', updateBusLocation);
busRouter.get('/live', protect, getLiveBusLocations);

// Academic Route
const academicRouter = express.Router();
academicRouter.use(protect);
academicRouter.get('/classes', getClasses);
academicRouter.get('/classes/:id/students', getClassStudents);
academicRouter.get('/subjects', getSubjects);
academicRouter.post('/classes', authorize('admin'), createClass);
academicRouter.post('/assign', authorize('admin'), assignStudent);

module.exports = { attendanceRouter, odRouter, noticeRouter, noteRouter, busRouter, academicRouter };
