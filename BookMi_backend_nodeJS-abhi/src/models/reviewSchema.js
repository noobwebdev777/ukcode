
const mongoose = require('mongoose');


const commentSchema = mongoose.Schema({
  review: { type: String },
  businessId: { type: mongoose.Schema.Types.ObjectId },
  serviceId: { type: mongoose.Schema.Types.ObjectId },
  rating: { type: Number, min: 1, max: 5, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId },
}, { timestamps: true })



module.exports = mongoose.model('review', commentSchema);