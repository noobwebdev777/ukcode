const mongoose = require('mongoose')

const categorySchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        countryCode: { type: String, required: true },
        logo: { type: String },
        delete: { type: Boolean, default: false },
        createdById: { type: mongoose.ObjectId },
        updatedById: { type: mongoose.ObjectId },
    },
    { timestamps: true }
)

module.exports = mongoose.model('category', categorySchema, 'categories')
