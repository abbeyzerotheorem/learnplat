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
const validateRequest = require('../middleware/validateRequest');
const { 
    createCourseValidator, 
    updateCourseValidator, 
    deleteCourseValidator,
    getCourseByIdValidator,
    addReviewValidator,
    getCourseQueryValidator
} = require('../validators/course.validator');

// Public routes
router.get('/', getCourseQueryValidator, validateRequest, getCourses);
router.get('/:id', getCourseByIdValidator, validateRequest, getCourseById);

// Protected routes
router.post('/', auth, authorize('instructor', 'admin'), createCourseValidator, validateRequest, createCourse);
router.put('/:id', auth, authorize('instructor', 'admin'), updateCourseValidator, validateRequest, updateCourse);
router.delete('/:id', auth, authorize('instructor', 'admin'), deleteCourseValidator, validateRequest, deleteCourse);
router.post('/:id/reviews', auth, addReviewValidator, validateRequest, addReview);

module.exports = router;