const genericController = new Object();
const appHelper = require("../helpers/appHelper");
const likeDal = require("../dal/likeDal");
const commentDal = require("../dal/commentDal");
const bookingDal = require("../dal/bookingDal");
const reviewDal = require("../dal/reviewDal");
const reportDal = require("../dal/reportDal");

genericController.likePortfolioImage = async (req) => {
  try {
    let reqBody = req.body;
    reqBody.userId = req.user._id;
    let likePortfolioImage = await likeDal.like(reqBody)
    if (!likePortfolioImage.status) {
      return appHelper.apiResponse(200, false, "failed to like", "failed to like");
    }
    return appHelper.apiResponse(200, true, "success", likePortfolioImage.data);
  } catch (error) {
    console.log("login failed with error", error);
    return appHelper.apiResponse(500, false, "failed to like", error.message ? error.message : error);
  }
};

genericController.postBusinessReview = async (req) => {
  try {
    let userId = req.user._id
    let reqBody = req.body;
    reqBody.userId = userId;
    let businessId =reqBody.businessId;
    let checkBooking = await bookingDal.getMyBookingForBusiness(businessId, userId)
    if(!checkBooking.status){
      return appHelper.apiResponse(200, false, "User Has not booked any services", "User Has not booked any services");
    }
    let checkExisting = await reviewDal.checkReview(reqBody)
    if (checkExisting.status) {
      return appHelper.apiResponse(200, false, "User Already reviewed", "User Already reviewed");
    }
    let likePortfolioImage = await reviewDal.review(reqBody)
    if (!likePortfolioImage.status) {
      return appHelper.apiResponse(200, false, "failed to review", "failed to review");
    }
    return appHelper.apiResponse(200, true, "success", likePortfolioImage.data);
  } catch (error) {
    console.log("login failed with error", error);
    return appHelper.apiResponse(500, false, "failed to review", error.message ? error.message : error);
  }
};



genericController.updateBusinessReview = async (req) => {
  try {
    let userId = req.user._id;
    let reqBody = req.body;
    let businessId = req.body.businessId
    let reviewId = req.params.reviewId;
    if(!reqBody.businessId || !reqBody.review || !reqBody.rating ){
      return appHelper.apiResponse(200, false, "Business / review / rating is missing",  "Business / review / rating is missing");
    }
    let findReview = await reviewDal.findReviewById(reviewId)
    if (!findReview.status) {
      return appHelper.apiResponse(200, false, "Review Does not exists", "Review Does not exists");
    }
    let data = findReview.data
    if (data.userId.toString() != userId.toString()) {
      return appHelper.apiResponse(200, false, "User not allowed to update others review", "User not allowed to update others review");
    }
    if (data.businessId.toString() != businessId.toString()) {
      return appHelper.apiResponse(200, false, "User not allowed to update others review", "User not allowed to update others review");
    }
    let updateReview = await reviewDal.updateReview(reviewId, reqBody)
    if (!updateReview.status) {
      return appHelper.apiResponse(200, false, "failed to review", "failed to review");
    }
    return appHelper.apiResponse(200, true, "success", updateReview);
  } catch (error) {
    console.log("login failed with error", error);
    return appHelper.apiResponse(500, false, "failed to review", error.message ? error.message : error);
  }
};

genericController.commentPortfolioImage = async (req) => {
  try {
    let reqBody = req.body;
    reqBody.userId = req.user._id;
    let likePortfolioImage = await commentDal.comment(reqBody)
    if (!likePortfolioImage.status) {
      return appHelper.apiResponse(200, false, "failed to comment", "failed to comment");
    }
    return appHelper.apiResponse(200, true, "success", likePortfolioImage.data);
  } catch (error) {
    console.log("login failed with error", error);
    return appHelper.apiResponse(500, false, "failed to comment", error.message ? error.message : error);
  }
};


genericController.reportBusiness = async (req) => {
  try {
    let reqBody = req.body;
    reqBody.userId = req.user._id;
    let likePortfolioImage = await reportDal.reportBusiness(reqBody)
    if (!likePortfolioImage.status) {
      return appHelper.apiResponse(200, false, "failed to comment", "failed to comment");
    }
    return appHelper.apiResponse(200, true, "success", likePortfolioImage.data);
  } catch (error) {
    console.log("login failed with error", error);
    return appHelper.apiResponse(500, false, "failed to comment", error.message ? error.message : error);
  }
};


// genericController.rateBusiness = async (req) => {
//   try {
//     let reqBody = req.body;
//     reqBody.userId = req.user._id;
//     let rateBusiness = await ratingDal.rateBusiness(reqBody)
//     if(!rateBusiness.status){
//       return appHelper.apiResponse(200, false, "failed to rate business", "failed to  rate business");
//     }
//     return appHelper.apiResponse(200, true, "success", rateBusiness.data);
//   }  catch (error) {
//     console.log("login failed with error", error);
//     return appHelper.apiResponse(500, false, "failed to rate business", error.message ? error.message : error);
//   }
// };

genericController.getCommentForPortfolioImage = async (req) => {
  try {
    let businessId = req.params.businessId;
    let imageId = req.params.portfolioId;
    let commentData = await commentDal.getCommentForPortfolioImage(businessId, imageId)
    if (!commentData.status) {
      return appHelper.apiResponse(200, false, "failed to get comment for portfolio", "error");
    }
    return appHelper.apiResponse(200, true, "success", commentData.data);
  } catch (error) {
    console.log("login failed with error", error);
    return appHelper.apiResponse(500, false, "failed to review", error.message ? error.message : error);
  }
};

genericController.getBusinessReviewData = async (req) => {
  try {
    let businessId = req.params.businessId;
    let userId = req.user._id;
    let reviewed = 0
    let reviewData = await reviewDal.getReviewDataForBusiness(businessId)
    if (!reviewData.status) {
      return appHelper.apiResponse(200, false, "failed to review", "failed to review");
    }
    let checkBooking = await bookingDal.getMyBookingForBusiness(businessId, userId)
    let serviceId = checkBooking?.data?.services && checkBooking.data.services[0].serviceId ? checkBooking.data.services[0].serviceId : undefined;
    if (checkBooking.status) reviewed = 1
    let data = reviewData.data;
    data.find(e => (e && e.userDetails && e.userDetails._id && (e.userDetails._id.toString() === userId.toString()))) && reviewed === 1 ? reviewed = 2 : '';
    let count = {
      reviewCount: data.length,
      averageRating: data.reduce((total, next) => total + next.rating, 0) / data.length,
      oneStar: data.filter(e => e && e.rating === 1)?.length || 0,
      twoStar: data.filter(e => e && e.rating === 2)?.length || 0,
      threeStar: data.filter(e => e && e.rating === 3)?.length || 0,
      fourStar: data.filter(e => e && e.rating === 4)?.length || 0,
      fiveStar: data.filter(e => e && e.rating === 5)?.length || 0,
      userReviewStatus: reviewed,
      serviceId: reviewed === 1 ? serviceId : undefined
    }
    return appHelper.apiResponse(200, true, "success", data, count);
  } catch (error) {
    console.log("login failed with error", error);
    return appHelper.apiResponse(500, false, "failed to review", error.message ? error.message : error);
  }
};

genericController.getMyReview = async (req) => {
  try {
    let userId = req.user._id;
    let reviewData = await reviewDal.getMyReviewData(userId)
    if (!reviewData.status) {
      return appHelper.apiResponse(200, false, "failed to review", "failed to review");
    }
    
    return appHelper.apiResponse(200, true, "success", reviewData.data);
  } catch (error) {
    console.log("login failed with error", error);
    return appHelper.apiResponse(500, false, "failed to review", error.message ? error.message : error);
  }
};


module.exports = genericController;
