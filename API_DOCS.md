# Smart Campus Companion - API Documentation

## Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

## Academic
- `GET /api/academic/classes` - Get all classes
- `GET /api/academic/classes/:id/students` - Get students of a class
- `GET /api/academic/subjects` - Get subjects (assigned to teacher)
- `POST /api/academic/classes` - Create class (Admin)
- `POST /api/academic/assign` - Assign student to class (Admin)

## Attendance
- `POST /api/attendance` - Mark attendance (Teacher)
- `GET /api/attendance/class/:classId` - Get class attendance
- `GET /api/attendance/my` - Get student's own attendance

## Duty Leave (OD)
- `POST /api/od` - Apply for OD (Student)
- `GET /api/od/my` - Get my OD requests
- `GET /api/od/pending` - Get pending OD requests (Teacher)
- `PUT /api/od/:id` - Approve/Reject OD (Teacher)

## Notices
- `GET /api/notices` - Get all notices
- `POST /api/notices` - Post a notice (Teacher/Admin)

## Notes
- `GET /api/notes` - Get my notes
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

## Bus Tracking
- `POST /api/bus/location` - Update bus location (Sensor)
- `GET /api/bus/live` - Get live location of all buses
