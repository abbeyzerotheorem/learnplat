const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

exports.enrollCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const studentId = req.user._id;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            student: studentId,
            course: courseId
        });

        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                message: 'Already enrolled in this course'
            });
        }

        // Create enrollment
        const enrollment = new Enrollment({
            student: studentId,
            course: courseId
        });

        await enrollment.save();

        // Add student to course's enrolledStudents
        course.enrolledStudents.push(studentId);
        await course.save();

        // Add course to user's enrolledCourses
        req.user.enrolledCourses.push(courseId);
        await req.user.save();

        res.status(201).json({
            success: true,
            message: 'Successfully enrolled in course',
            enrollment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to enroll in course',
            error: error.message
        });
    }
};

exports.getEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user._id })
            .populate('course', 'title thumbnail instructor')
            .sort({ lastAccessed: -1 });

        res.json({
            success: true,
            enrollments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch enrollments',
            error: error.message
        });
    }
};

exports.updateProgress = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const { lectureId, completed } = req.body;

        const enrollment = await Enrollment.findById(enrollmentId);

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found'
            });
        }

        // Check if user owns this enrollment
        if (enrollment.student.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // Update completed lectures
        if (completed && lectureId) {
            if (!enrollment.completedLectures.includes(lectureId)) {
                enrollment.completedLectures.push(lectureId);
            }
        }

        // Calculate progress (this would need course total lectures)
        const course = await Course.findById(enrollment.course);
        const totalLectures = course.totalLectures || 1;
        enrollment.progress = Math.round(
            (enrollment.completedLectures.length / totalLectures) * 100
        );

        // Check if course completed
        if (enrollment.progress === 100 && !enrollment.completed) {
            enrollment.completed = true;
            enrollment.completedAt = new Date();
        }

        enrollment.lastAccessed = new Date();
        await enrollment.save();

        res.json({
            success: true,
            message: 'Progress updated',
            enrollment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update progress',
            error: error.message
        });
    }
};