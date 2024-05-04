const mongoose = require('mongoose');

const businessSchema = mongoose.Schema({
  businessName: { type: String, required: true },
  businessMobile: { type: String, required: true },
  businessLogo: { type: String },
  businessCover: { type: String },
  ownerName: { type: String },
  description: { type: String },
  categoryId: { type: mongoose.ObjectId },
  atMyPlace: { type: Boolean, default: false },
  atClientPlace: { type: Boolean, default: false },
  address: {
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    postCode: { type: String },
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        default: "Point",
        required: true
      },
      coordinates: {
        type: [{ type: Number, min: -180, max: 180 }, { type: Number, min: -90, max: 90  }],
        validate: [arrayLimit, '{PATH} exceeds the limit of 2'],
        required: true
      }
    },
    // coordinate: {
    //   latitude: { type: Number },
    //   longitude: { type: Number }
    // },
  },
  travelFees: [{
    priceType: { type: String },
    fee: { type: Number },
    maximumTravelDistance: { type: Number },
    travelFeePolicy: { type: String },
  }],
  openHours: [{
    dayOfWeek: { type: Number },
    openTill: { type: String },
    openFrom: { type: String }
  }],
  deleted: { type: Boolean, default: false },
  recommended: { type: Boolean, default: false },
  images: [{ type: String }],
  portfolioImages: [{ type: String }],
  belongTo: { type: mongoose.ObjectId },
  createdById: { type: mongoose.ObjectId },
  updatedById: { type: mongoose.ObjectId }

}, { timestamps: true })


businessSchema.pre('save', async function (next) {
  if (this.images && this.images.length > 0) {
    let images = this.images;
    let updatedImages = [];
    for (const image of images) {
      if (image) {
        updatedImages.push(updatedImages)
      }
    }
    this.images = updatedImages
  }
  next()
}) 



function arrayLimit(val) {
  return val.length <= 2;
}

businessSchema.index({ "address.location": "2dsphere" });

module.exports = mongoose.model('business', businessSchema);