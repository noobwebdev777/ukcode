const mongoose = require('mongoose')

const fileSchema = mongoose.Schema(
    {
        mimeType: { type: String },
        name: { type: String },
        type: { type: String, enum: ['PROFILE', 'PORTFOLIO', 'REVIEW'] },
        businessId: { type: mongoose.Schema.Types.ObjectId },
        fileData: { type: String },
        fileSize: { type: String },
        uploadedById: { type: mongoose.Schema.Types.ObjectId },
        moduleId: { type: mongoose.Schema.Types.ObjectId },
    },
    { timestamps: true }
)

module.exports = mongoose.model('file', fileSchema)
