
const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
  liked: { type: Boolean, default: false },
  businessId: { type: mongoose.Schema.Types.ObjectId, required: true },
  imageId: { type: mongoose.Schema.Types.ObjectId },
  userId: { type: mongoose.Schema.Types.ObjectId },
}, { timestamps: true })



module.exports = mongoose.model('like', likeSchema);