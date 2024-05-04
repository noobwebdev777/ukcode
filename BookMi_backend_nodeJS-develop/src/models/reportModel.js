
const mongoose = require('mongoose');


const reportSchema = mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId },
  reason: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId },
}, { timestamps: true })



module.exports = mongoose.model('report', reportSchema);