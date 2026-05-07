const { body, param, query } = require('express-validator');

// Create course validation
const createCourseValidator = [
    body('title')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Title must be between 5 and 200 characters'),
    body('subtitle')
        .optional()
        .trim()
        .isLength({ max: 300 })
        .withMessage('Subtitle must not exceed 300 characters'),
    body('description')
        .trim()
        .isLength({ min: 20, max: 5000 })
        .withMessage('Description must be between 20 and 5000 characters'),
    body('category')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Category is required'),
    body('subcategory')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Subcategory must not exceed 50 characters'),
    body('price')
        .isFloat({ min: 0, max: 999999 })
        .withMessage('Price must be a valid number between 0 and 999999'),
    body('discountedPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Discounted price must be a valid number')
        .custom((value, { req }) => {
            if (value && value >= req.body.price) {
                throw new Error('Discounted price must be less than original price');
            }
            return true;
        }),
    body('thumbnail')
        .trim()
        .isURL()
        .withMessage('Thumbnail must be a valid URL'),
    body('promoVideo')
        .optional()
        .trim()
        .isURL()
        .withMessage('Promo video must be a valid URL'),
    body('prerequisites')
        .optional()
        .isArray()
        .withMessage('Prerequisites must be an array'),
    body('learningObjectives')
        .optional()
        .isArray()
        .withMessage('Learning objectives must be an array'),
    body('targetAudience')
        .optional()
        .isArray()
        .withMessage('Target audience must be an array'),
    body('level')
        .optional()
        .isIn(['beginner', 'intermediate', 'advanced', 'all'])
        .withMessage('Level must be beginner, intermediate, advanced, or all'),
    body('language')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Language must be valid')
];

// Update course validation
const updateCourseValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid course ID'),
    body('title')
        .optional()
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Title must be between 5 and 200 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ min: 20, max: 5000 })
        .withMessage('Description must be between 20 and 5000 characters'),
    body('price')
        .optional()
        .isFloat({ min: 0, max: 999999 })
        .withMessage('Price must be a valid number'),
    body('discountedPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Discounted price must be a valid number')
];

// Delete course validation
const deleteCourseValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid course ID')
];

// Get course by ID validation
const getCourseByIdValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid course ID')
];

// Add review validation
const addReviewValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid course ID'),
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    body('text')
        .optional()
        .trim()
        .isLength({ min: 5, max: 1000 })
        .withMessage('Review text must be between 5 and 1000 characters')
];

// Query validation for get courses
const getCourseQueryValidator = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('category')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Category must be valid'),
    query('level')
        .optional()
        .isIn(['beginner', 'intermediate', 'advanced', 'all'])
        .withMessage('Level must be valid'),
    query('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Min price must be a valid number'),
    query('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Max price must be a valid number'),
    query('sortBy')
        .optional()
        .isIn(['createdAt', 'price', 'rating', 'enrollments'])
        .withMessage('Invalid sort field'),
    query('order')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Order must be asc or desc')
];

module.exports = {
    createCourseValidator,
    updateCourseValidator,
    deleteCourseValidator,
    getCourseByIdValidator,
    addReviewValidator,
    getCourseQueryValidator
};
