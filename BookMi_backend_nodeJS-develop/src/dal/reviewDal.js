const reviewSchema = require("../models/reviewSchema");
const reviewDal = new Object();
const ObjectId = require('mongoose').Types.ObjectId

reviewDal.review = async (data) => {
  try {
    let review = new reviewSchema(data);
    let result = await review.save();
    if (result) {
      return { status: true, data: result };
    }
    return { status: false, data: result }
  } catch (error) {
    console.log(error);
    return { status: false, data: error.message ? error.message : error }
  }
}


reviewDal.checkReview = async (data) => {
  try {
    let getReview = await reviewSchema.findOne({ businessId: ObjectId(data.businessId), userId: ObjectId(data.userId) }).lean()
    if (getReview) {
      return { status: true, data: getReview };
    }
    return { status: false, data: getReview }
  } catch (error) {
    console.log(error);
    return { status: false, data: error.message ? error.message : error }
  }
}

reviewDal.findReviewById = async (reviewId) => {
  try {
    let getReview = await reviewSchema.findById(reviewId).lean()
    if (getReview) {
      return { status: true, data: getReview };
    }
    return { status: false, data: getReview }
  } catch (error) {
    console.log(error);
    return { status: false, data: error.message ? error.message : error }
  }
}

reviewDal.updateReview = async (reviewId, body) => {
  try {
    let updateReview = await reviewSchema.findByIdAndUpdate(reviewId, { review: body.review, rating: body.rating }, { new: true })
    if (updateReview) {
      return { status: true, data: updateReview };
    }
    return { status: false, data: updateReview }
  } catch (error) {
    console.log(error);
    return { status: false, data: error.message ? error.message : error }
  }
}

reviewDal.getReviewDataForBusiness = async (businessId) => {
  try {
    let result = await reviewSchema.aggregate()
      .match({ businessId: ObjectId(businessId) })
      .lookup({ from: "accounts", localField: "userId", foreignField: "_id", as: "userDetails" })
      .lookup({ from: "businesses", localField: "businessId", foreignField: "_id", as: "businessDetails" })
      .lookup({ from: "businessservices", localField: "serviceId", foreignField: "_id", as: "serviceDetails" })
      .unwind({ path: '$userDetails', preserveNullAndEmptyArrays: true })
      .unwind({ path: '$businessDetails', preserveNullAndEmptyArrays: true })
      .unwind({ path: '$serviceDetails', preserveNullAndEmptyArrays: true })
      .project({
        _id: 1,
        review: 1,
        rating: 1,
        updatedAt: 1,
        createdAt: 1,
        userDetails: {
          name: 1,
          _id: 1
        },
        businessDetails: {
          _id: 1,
          businessName: 1,
          address: 1,
          images: 1
        },
        serviceDetails: {
          _id: 1,
          name: 1
        }
      })
      .exec()
    return { status: true, data: result };
  } catch (error) {
    console.log(error);
    return { status: false, data: error.message ? error.message : error }
  }
}

reviewDal.getMyReviewData = async (userId) => {
  try {
    let result = await reviewSchema.aggregate()
      .match({ userId: ObjectId(userId) })
      .lookup({ from: "accounts", localField: "userId", foreignField: "_id", as: "userDetails" })
      .lookup({ from: "businesses", localField: "businessId", foreignField: "_id", as: "businessDetails" })
      .lookup({ from: "businessservices", localField: "serviceId", foreignField: "_id", as: "serviceDetails" })
      .unwind({ path: '$userDetails', preserveNullAndEmptyArrays: true })
      .unwind({ path: '$businessDetails', preserveNullAndEmptyArrays: true })
      .unwind({ path: '$serviceDetails', preserveNullAndEmptyArrays: true })
      .project({
        _id: 1,
        review: 1,
        rating: 1,
        updatedAt: 1,
        createdAt: 1,
        userDetails: {
          _id: 1,
          name: 1
        },
        businessDetails: {
          _id: 1,
          businessName: 1,
          address: 1,
          images: 1
        },
        serviceDetails: {
          _id: 1,
          name: 1
        }
      })
      .exec()
    return { status: true, data: result };
  } catch (error) {
    console.log(error);
    return { status: false, data: error.message ? error.message : error }
  }
}

reviewDal.deleteAllReviewsForUser = async (accountId) => {
  try {
    return reviewSchema.deleteMany({ userId: accountId })
  } catch (error) {
    console.log(error);
    return { status: false, data: error.message ? error.message : error }
  }
}

module.exports = reviewDal;