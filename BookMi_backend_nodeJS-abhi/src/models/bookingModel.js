const mongoose = require('mongoose')

const bookingSchema = mongoose.Schema(
    {
        businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'business' },
        bookedById: { type: mongoose.Schema.Types.ObjectId },
        bookingId: { type: Number, default: Date.now() },
        status: {
            type: String,
            enum: ['BOOKED', 'CANCELLED', 'FINISHED'],
            default: 'BOOKED',
        },
        services: [
            {
                _id: false,
                serviceId: { type: mongoose.Schema.Types.ObjectId },
                start: { type: Date, required: true },
                end: { type: Date, required: true },
                offerId: { type: mongoose.Schema.Types.ObjectId },
                appliedOfferType: { type: String },
                serviceName: { type: String },
                discountPercentage: { type: Number },
                discountAmount: { type: Number },
                amount: { type: Number },
            },
        ],
        total: { type: Number },
        totalDiscountAmount: { type: Number },
        note: { type: String },
        email: { type: String },
        name: { type: String },
        timezone: { type: String },
        staffUserId: { type: String, default: '' },
    },
    { timestamps: true }
)

module.exports = mongoose.model('booking', bookingSchema)
