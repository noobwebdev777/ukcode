
const mongoose = require('mongoose');


const ratingSchema = mongoose.Schema({
  rating: { type: Number, min: 1, max: 5 },
  businessId: { type: mongoose.Schema.Types.ObjectId },
  // imageId: { type: mongoose.Schema.Types.ObjectId },
  userId: { type: mongoose.Schema.Types.ObjectId },
}, { timestamps: true })



module.exports = mongoose.model('rating', ratingSchema);