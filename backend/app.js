const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const propertyRoutes = require('./routes/propertyRoutes');
const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');

// Create required directories if they don't exist
const createRequiredDirs = () => {
  const dirs = [
    './uploads',
    './uploads/temp',
    './uploads/properties',
    './data'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    } else {
      console.log(`Directory exists: ${dir}`);
    }
  });
};

// Create required directories
createRequiredDirs();

// Middleware
app.use(cors());
app.use(express.json());

// Log static file requests
app.use('/uploads', (req, res, next) => {
  const filePath = path.join(__dirname, 'uploads', req.path);
  console.log(`Static file request: ${req.originalUrl}`);
  console.log(`Resolved file path: ${filePath}`);
  console.log(`__dirname: ${__dirname}`);
  if (fs.existsSync(filePath)) {
    console.log(`File exists: ${filePath}`);
  } else {
    console.log(`File does not exist: ${filePath}`);
  }
  next();
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    console.log(`Serving file: ${filePath}`);
    res.set('Content-Type', 'image/jpeg');
  }
}));

// Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ success: false, message: 'Something went wrong!', error: err.message });
});

module.exports = app;