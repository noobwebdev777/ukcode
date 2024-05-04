const mongoose = require('mongoose')

const businessStaffVacationSchema = mongoose.Schema({
    businessId: {
        type: String,
    },
    userId: {
        type: String,
    },
    start: {
        type: Number,
    },
    end: {
        type: Number,
    },
})

module.exports = mongoose.model(
    'businessStaffVacation',
    businessStaffVacationSchema,
    'businessStaffVacation'
)
