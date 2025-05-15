// backend/app.js
const express = require('express');
const cors = require('cors');
const app = express();
const propertyRoutes = require('./routes/propertyRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(cors());
app.use(express.json());
app.use('/api/properties', propertyRoutes);
app.use('/api/auth', authRoutes);


module.exports = app;



