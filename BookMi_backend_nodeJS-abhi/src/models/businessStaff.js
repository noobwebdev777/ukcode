const mongoose = require('mongoose')

const businessStaffSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    gender: {
        type: String,
        enum: ['m', 'f'],
        required: true,
    },
})

module.exports = mongoose.model('businessStaff', businessStaffSchema)
