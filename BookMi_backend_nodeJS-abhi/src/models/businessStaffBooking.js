const mongoose = require('mongoose')

const businessStaffBookingSchema = mongoose.Schema({
    bookingId: {
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
    start: {
        type: Number,
        required: true,
    },
    end: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Number,
        required: true,
    },
})

module.exports = mongoose.model(
    'businessStaffBooking',
    businessStaffBookingSchema
)
