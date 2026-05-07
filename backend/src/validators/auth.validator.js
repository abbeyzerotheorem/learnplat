const { body } = require('express-validator');

// Register validation
const registerValidator = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain uppercase, lowercase, and number'),
    body('role')
        .optional()
        .isIn(['student', 'instructor', 'admin'])
        .withMessage('Role must be student, instructor, or admin')
];

// Login validation
const loginValidator = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Update profile validation
const updateProfileValidator = [
    body('fullName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters'),
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio must not exceed 500 characters'),
    body('avatar')
        .optional()
        .isURL()
        .withMessage('Avatar must be a valid URL'),
    body('socialLinks.website')
        .optional()
        .isURL()
        .withMessage('Website must be a valid URL'),
    body('socialLinks.twitter')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Twitter handle must be valid'),
    body('socialLinks.linkedin')
        .optional()
        .isURL()
        .withMessage('LinkedIn must be a valid URL'),
    body('socialLinks.github')
        .optional()
        .isURL()
        .withMessage('GitHub must be a valid URL')
];

module.exports = {
    registerValidator,
    loginValidator,
    updateProfileValidator
};
