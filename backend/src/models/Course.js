const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subtitle: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subcategory: String,
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discountedPrice: {
        type: Number,
        min: 0
    },
    thumbnail: {
        type: String,
        required: true
    },
    promoVideo: String,
    prerequisites: [String],
    learningObjectives: [String],
    targetAudience: [String],
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'all'],
        default: 'all'
    },
    language: {
        type: String,
        default: 'English'
    },
    totalHours: {
        type: Number,
        min: 0
    },
    totalLectures: {
        type: Number,
        min: 0
    },
    sections: [{
        title: {
            type: String,
            required: true
        },
        order: Number,
        lectures: [{
            title: {
                type: String,
                required: true
            },
            description: String,
            videoUrl: String,
            duration: Number, // in minutes
            order: Number,
            resources: [{
                name: String,
                url: String
            }]
        }]
    }],
    ratings: {
        average: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isPublished: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Course', courseSchema);