const offerSchema = require("../models/offer");
const offerDal = new Object();
const ObjectId = require('mongoose').Types.ObjectId

offerDal.saveOffer = async (data) => {
  try {
    let offer = new offerSchema(data);
    let result = await offer.save();
    if (result) {
      return { status: true, data: result };
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to save Users", error);
    if (error.code == '11000') {
      return { status: false, message: `${Object.keys(error.keyValue)[0]} is already taken` }
    } else {
      return { status: false, data: error.message ? error.message : error }
    }
  }
}

offerDal.findOffer = async (req) => {
  try {
    let result = await offerSchema.aggregate()
      .match({ delete: false })
      .sort({ createdAt: 1 })
      .lookup({from : "services", localField : "_id", foreignField : "offer", as : "services"})
      .exec()
    if (result) {
      return { status: true, data: result }
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to fetch clogs", error);
    return { status: false, data: error.message ? error.message : error }
  }
}

offerDal.findOfferDetails = async (id) => {
  try {
    let result = await offerSchema.findById(id);
    if (result) {
      return { status: true, data: result }
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to fetch clogs", error);
    return { status: false, data: error.message ? error.message : error }
  }
}

offerDal.findOfferTypeForBusiness = async (businessId, offerType) => {
  try {
    let result = await offerSchema.findOne({ businessId: ObjectId(businessId), type: offerType });
    if (result) {
      return { status: true, data: result }
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to fetch clogs", error);
    return { status: false, data: error.message ? error.message : error }
  }
}

offerDal.findOfferByIdAndUpdate = async (id, data) => {
  try {
    let result = await offerSchema.findByIdAndUpdate(id, data, { new: true })
    if (result) {
      return { status: true, data: result };
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to save Users", error);
    return { status: false, data: error.message ? error.message : error }

  }
}

offerDal.deleteOfferById = async (id) => {
  try {
    let result = await offerSchema.findByIdAndDelete(id);
    if (result) {
      return { status: true, data: result }
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to fetch clogs", error);
    return { status: false, data: error.message ? error.message : error }
  }
}

offerDal.deleteAllOffersForUser = async (accountId) => {
  try {
    return offerSchema.deleteMany({ createdById: accountId })
  } catch (error) {
    console.log(error);
    return { status: false, data: error.message ? error.message : error }
  }
}

module.exports = offerDal;