const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    completedLectures: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    lastAccessed: {
        type: Date,
        default: Date.now
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: Date,
    certificateIssued: {
        type: Boolean,
        default: false
    },
    certificateIssuedAt: Date
});

// Create compound index for uniqueness
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);