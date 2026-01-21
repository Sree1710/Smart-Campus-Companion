# Smart Campus Companion (MERN Stack)

A unified, intelligent platform for campus management including attendance, duty leaves, bus tracking, and personal tools.

## Project Overview

Smart Campus Companion is a full-stack web application designed to streamline campus activities. It provides role-based interfaces for Students, Teachers, and Administrators to manage academic and logistical tasks efficiently.

## Features

- **Role-Based Access**: Specialized dashboards for Students, Teachers, and Admins.
- **Attendance Management**: Teachers mark attendance; students can view their detailed records.
- **Duty Leave (OD) System**: Digital application, tracking, and approval workflow for On-Duty leaves.
- **Bus Tracking**: Real-time location tracking of college buses on an interactive map.
- **Digital Notes**: A Google Keep-style personal note-taking application for students.
- **Digital Notices**: Centralized notice board for academic and general announcements.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Tools**: Google Maps API (React Wrapper), Concurrently

## Folder Structure

```
Smart-Campus-Companion/
├── client/                 # React Frontend
│   ├── src/
│   ├── public/
│   └── vite.config.js
├── server/                 # Node/Express Backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route logic
│   ├── middleware/        # Auth & error handling
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API definitions
│   └── seeder.js          # Database Utility
└── package.json           # Root scripts and dependencies
```

## Setup & Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (Running locally or via Atlas)

### Installation Steps

1.  **Clone and Install Dependencies**
    ```bash
    # Install root dependencies (concurrently, etc.)
    npm install

    # Install backend dependencies
    cd server
    npm install
    cd ..

    # Install frontend dependencies
    cd client
    npm install
    cd ..
    ```

2.  **Environment Configuration**

    Create a `.env` file in the `server/` directory:
    ```env
    NODE_ENV=development
    PORT=5001
    MONGO_URI=mongodb://127.0.0.1:27017/campus_companion
    JWT_SECRET=your_super_secret_jwt_key
    ```
    
    *Note: Ensure your MongoDB server is running.*

3.  **Database Seeding**
    To populate the database with initial data (Admin user), run:
    ```bash
    node server/seeder.js
    ```
    *   **Admin Login**: `admin@test.com` / `password123`
    *   To destroy all data: `node server/seeder.js -d`

## Running the Project

From the root directory, run the development command to start both the server and client concurrently:

```bash
npm run dev
```

- **Frontend**: Runs on `http://localhost:5173` (typically)
- **Backend**: Runs on `http://localhost:5001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Academic Management
- `GET /api/academic/classes` - Get all classes
- `GET /api/academic/classes/:id/students` - Get students of a specific class
- `GET /api/academic/subjects` - Get subjects (assigned to teacher)
- `POST /api/academic/classes` - Create class (Admin only)
- `POST /api/academic/assign` - Assign student to class (Admin only)

### Attendance
- `POST /api/attendance` - Mark attendance (Teacher)
- `GET /api/attendance/class/:classId` - Get class attendance records
- `GET /api/attendance/my` - Get logged-in student's attendance

### Duty Leave (OD)
- `POST /api/od` - Apply for OD (Student)
- `GET /api/od/my` - Get my OD requests
- `GET /api/od/pending` - Get pending OD requests (Teacher)
- `PUT /api/od/:id` - Approve/Reject OD (Teacher)

### Notices
- `GET /api/notices` - Get all notices
- `POST /api/notices` - Post a notice (Teacher/Admin)

### Personal Notes
- `GET /api/notes` - Get my notes
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update an existing note
- `DELETE /api/notes/:id` - Delete a note

### Bus Tracking
- `POST /api/bus/location` - Update bus location (Sensor)
- `GET /api/bus/live` - Get live location of all buses
