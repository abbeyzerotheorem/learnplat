const express = require('express');
const router = express.Router();
const { 
    createCourse, 
    getCourses, 
    getCourseById, 
    updateCourse, 
    deleteCourse,
    addReview
} = require('../controllers/course.controller');
const { auth, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Protected routes
router.post('/', auth, authorize('instructor', 'admin'), createCourse);
router.put('/:id', auth, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', auth, authorize('instructor', 'admin'), deleteCourse);
router.post('/:id/reviews', auth, addReview);

module.exports = router;