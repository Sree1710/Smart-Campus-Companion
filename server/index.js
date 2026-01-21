const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Load environment variables (Render + Local compatible)
dotenv.config();

const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

/**
 * =========================
 * CORS CONFIGURATION
 * =========================
 * Allows Vercel frontend + other trusted origins
 */
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security & logging
// app.use(helmet()); // Enable later if needed
app.use(morgan('dev'));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/**
 * =========================
 * ROUTES
 * =========================
 */
const auth = require('./routes/auth');
const {
  attendanceRouter,
  odRouter,
  noticeRouter,
  noteRouter,
  busRouter,
  academicRouter
} = require('./routes/core');

app.use('/api/auth', auth);
app.use('/api/attendance', attendanceRouter);
app.use('/api/od', odRouter);
app.use('/api/notices', noticeRouter);
app.use('/api/notes', noteRouter);
app.use('/api/bus', busRouter);
app.use('/api/academic', academicRouter);
app.use('/api/users', require('./routes/users'));

/**
 * =========================
 * HEALTH CHECK
 * =========================
 */
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is live and running on Render 🚀',
  });
});

/**
 * =========================
 * ROOT ROUTE
 * =========================
 */
app.get('/', (req, res) => {
  res.send('Smart Campus Companion API is running...');
});

/**
 * =========================
 * ERROR HANDLING
 * =========================
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

/**
 * =========================
 * SERVER START
 * =========================
 */
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});
