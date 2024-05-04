const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serviceSchema = Schema(
    {
        category: { type: Schema.Types.ObjectId, ref: 'category' },
        name: { type: String, required: true },
        description: { type: String },
        duration: {
            hours: { type: Number, default: 0 },
            minutes: { type: Number, default: 15 },
        },
        price: { type: Number, default: 0 },
        priceType: { type: String },
        logo: { type: String },
        delete: { type: Boolean, default: false },
        createdById: { type: mongoose.ObjectId },
        updatedById: { type: mongoose.ObjectId },
    },
    { timestamps: true }
)

module.exports = mongoose.model('service', serviceSchema)
