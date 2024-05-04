const mongoose = require('mongoose')

const businessServiceSchema = mongoose.Schema(
    {
        businessId: {
            type: mongoose.ObjectId,
            required: true,
            ref: 'business',
        },
        name: { type: String, required: true },
        description: { type: String },
        categoryId: { type: mongoose.ObjectId, ref: 'category' },
        duration: {
            hours: { type: Number, default: 0 },
            minutes: { type: Number, default: 0 },
        },
        price: { type: Number },
        allowedSeats: { type: Number, default: 1 },
        // priceType: { type: String },
        // mobileService: { type: Boolean, default: false },
        gender: {
            type: String,
            enum: ['m', 'f', 'a'], // male, female, any
            default: 'a',
        },

        createdById: { type: mongoose.ObjectId },
        updatedById: { type: mongoose.ObjectId },
    },
    { timestamps: true }
)

module.exports = mongoose.model('businessService', businessServiceSchema)
