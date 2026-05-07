const express = require('express');
const router = express.Router();
const { enrollCourse, getEnrollments, updateProgress } = require('../controllers/enrollment.controller');
const { auth } = require('../middleware/auth');

router.post('/:courseId', auth, enrollCourse);
router.get('/', auth, getEnrollments);
router.put('/:enrollmentId/progress', auth, updateProgress);

module.exports = router;