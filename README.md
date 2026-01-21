# Smart Campus Companion (MERN Stack)

A unified, intelligent platform for campus management including attendance, duty leaves, bus tracking, and personal tools.

## Features
- **Role-Based Access**: Student, Teacher, Admin dashboards.
- **Attendance**: Teachers mark attendance; students view records.
- **Duty Leave (OD)**: Digital application and approval workflow.
- **Bus Tracking**: Real-time location tracking on map.
- **Notes**: Google Keep-style notes for students.
- **Notices**: Digital notice board.

## Tech Stack
- Frontend: React (Vite), Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- Maps: Google Maps API (React Wrapper)

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (Running locally or Atlas URI)

### Installation
1. **Clone and Install Dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install server dependencies
   cd server && npm install

   # Install client dependencies
   cd client && npm install
   ```

2. **Environment Configuration**
   - Create `.env` in `server/` (see `server/.env.example`)
     ```
     MONGO_URI=mongodb://localhost:27017/smart_campus
     JWT_SECRET=your_secret
     PORT=5000
     ```
   - Create `.env` in `client/`
     ```
     VITE_GOOGLE_MAPS_API_KEY=your_key
     ```

3. **Run Application**
   From the root directory:
   ```bash
   npm run dev
   ```
   This starts both Server (Port 5000) and Client (Port 5173).

## API Documentation
See [API_DOCS.md](./API_DOCS.md) for endpoint details.
