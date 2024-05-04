
const mongoose = require('mongoose');


const commentSchema = mongoose.Schema({
  comment: { type: String },
  businessId: { type: mongoose.Schema.Types.ObjectId },
  serviceId: { type: mongoose.Schema.Types.ObjectId },
  imageId: { type: mongoose.Schema.Types.ObjectId },
  userId: { type: mongoose.Schema.Types.ObjectId },
}, { timestamps: true })



module.exports = mongoose.model('comment', commentSchema);