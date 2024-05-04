const mongoose = require('mongoose');

const offerSchema = mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'business' },
  status: { type: String, enum: ['Running', 'Inactive'], default: 'Inactive' },
  type: { type: String, enum: ['Flash_Sale', 'Last_Minute_Discount', 'Happy_hours'], required: true },
  flashSale: {
    discountPercentage: { type: Number, min: 0, max: 100 },
    salePeriod: { type: String },
    from: { type: Date },
    to: { type: Date },
  },
  lastMinuteDiscount: {
    discountPercentage: { type: Number, min: 0, max: 100 },
    bookingWindow: { type: Number },
  },
  happyHours: [{
    _id: false,
    active: { type: Boolean },
    dayOfWeek: { type: Number, min: 0, max: 6 },
    discountPercentage: { type: Number, min: 0, max: 100 },
    openFrom: { type: String },
    openTill: { type: String }
  }],
  createdById: { type: mongoose.ObjectId },
  updatedById: { type: mongoose.ObjectId }
}, { timestamps: true })



module.exports = mongoose.model('offer', offerSchema);