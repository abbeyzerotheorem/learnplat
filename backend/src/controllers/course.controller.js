const Course = require('../models/Course');
const Review = require('../models/Review');

exports.createCourse = async (req, res) => {
    try {
        if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only instructors can create courses'
            });
        }

        const courseData = {
            ...req.body,
            instructor: req.user._id
        };

        const course = new Course(courseData);
        await course.save();

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create course',
            error: error.message
        });
    }
};

exports.getCourses = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            category, 
            level, 
            instructor,
            search,
            minPrice,
            maxPrice,
            sortBy = 'createdAt',
            order = 'desc'
        } = req.query;

        const query = { isPublished: true };

        // Filtering
        if (category) query.category = category;
        if (level) query.level = level;
        if (instructor) query.instructor = instructor;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        // Sorting
        const sort = {};
        sort[sortBy] = order === 'desc' ? -1 : 1;

        // Pagination
        const skip = (page - 1) * limit;

        const courses = await Course.find(query)
            .populate('instructor', 'username profile')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Course.countDocuments(query);

        res.json({
            success: true,
            courses,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch courses',
            error: error.message
        });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'username profile')
            .populate('reviews');

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Get reviews separately for better control
        const reviews = await Review.find({ course: course._id })
            .populate('student', 'username profile')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            course: {
                ...course.toObject(),
                reviews
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch course',
            error: error.message
        });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if user is the instructor or admin
        if (course.instructor.toString() !== req.user._id.toString() && 
            req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this course'
            });
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Course updated successfully',
            course: updatedCourse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update course',
            error: error.message
        });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if user is the instructor or admin
        if (course.instructor.toString() !== req.user._id.toString() && 
            req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this course'
            });
        }

        await course.deleteOne();

        res.json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete course',
            error: error.message
        });
    }
};

exports.addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const courseId = req.params.id;

        // Check if enrolled
        const course = await Course.findById(courseId);
        if (!course.enrolledStudents.includes(req.user._id)) {
            return res.status(403).json({
                success: false,
                message: 'You must enroll in the course to leave a review'
            });
        }

        // Check if already reviewed
        const existingReview = await Review.findOne({
            student: req.user._id,
            course: courseId
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this course'
            });
        }

        // Create review
        const review = new Review({
            student: req.user._id,
            course: courseId,
            rating,
            comment
        });

        await review.save();

        // Update course ratings
        const reviews = await Review.find({ course: courseId });
        const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        course.ratings.average = average;
        course.ratings.count = reviews.length;
        await course.save();

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add review',
            error: error.message
        });
    }
};