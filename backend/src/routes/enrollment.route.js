const express = require('express');
const router = express.Router();
const { enrollCourse, getEnrollments, updateProgress } = require('../controllers/enrollment.controller');
const { auth } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { enrollCourseValidator, updateProgressValidator } = require('../validators/enrollment.validator');

router.post('/:courseId', auth, enrollCourseValidator, validateRequest, enrollCourse);
router.get('/', auth, getEnrollments);
router.put('/:enrollmentId/progress', auth, updateProgressValidator, validateRequest, updateProgress);

module.exports = router;