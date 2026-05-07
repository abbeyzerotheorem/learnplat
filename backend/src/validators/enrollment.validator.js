const { body, param } = require('express-validator');

// Enroll course validation
const enrollCourseValidator = [
    param('courseId')
        .isMongoId()
        .withMessage('Invalid course ID')
];

// Update progress validation
const updateProgressValidator = [
    param('enrollmentId')
        .isMongoId()
        .withMessage('Invalid enrollment ID'),
    body('progress')
        .isInt({ min: 0, max: 100 })
        .withMessage('Progress must be between 0 and 100'),
    body('currentLessonIndex')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Lesson index must be a non-negative integer'),
    body('completedLessons')
        .optional()
        .isArray()
        .withMessage('Completed lessons must be an array')
];

module.exports = {
    enrollCourseValidator,
    updateProgressValidator
};
