const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
// Middleware
// Manual CORS to fix persistent 403s with library
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log(`[DEBUG] Request Method: ${req.method}, Origin: ${origin}`);

  // Allow all origins or reflect request origin
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    // Fallback for non-browser tools
    res.header('Access-Control-Allow-Origin', '*');
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Explicitly log the decision for debugging
  console.log(`[DEBUG] Allowed Origin: ${res.get('Access-Control-Allow-Origin')}`);

  if (req.method === 'OPTIONS') {
    console.log('[DEBUG] Handling OPTIONS preflight');
    return res.status(200).send();
  }
  console.log('[DEBUG] Passing control to next middleware');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(helmet()); 
app.use(morgan('dev'));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const auth = require('./routes/auth');
const { attendanceRouter, odRouter, noticeRouter, noteRouter, busRouter, academicRouter } = require('./routes/core');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/attendance', attendanceRouter);
app.use('/api/od', odRouter);
app.use('/api/notices', noticeRouter);
app.use('/api/notes', noteRouter);
app.use('/api/bus', busRouter);
app.use('/api/academic', academicRouter);

// Routes (Placeholder)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
