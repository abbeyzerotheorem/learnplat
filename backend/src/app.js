const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Learning platform backend is running',
        routes: ['/api/auth', '/api/courses', '/api/enrollments']
    });
});

// Routes
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/courses', require('./routes/course.route'));
app.use('/api/enrollments', require('./routes/enrollment.route'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

module.exports = app;