
const mongoose = require('mongoose');


const businessHolidaySchema = mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'business' },
  createdById: { type: mongoose.Schema.Types.ObjectId },
  updatedById: { type: mongoose.Schema.Types.ObjectId },
  from: { type: Date },
  to: { type: Date }
}, { timestamps: true })



module.exports = mongoose.model('businessHolidays', businessHolidaySchema);