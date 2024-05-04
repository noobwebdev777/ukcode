const businessController = new Object();
const config = require('../config/config');
const appHelper = require("../helpers/appHelper");
const businessDal = require("../dal/businessDal");
const categoryDal = require("../dal/categoryDal");

businessController.createBusiness = async (req) => {
  try {
    let reqBody = req.body;
    reqBody.belongTo = req.user._id;
    reqBody.createdById = req.user._id;
    let createBusiness = await businessDal.saveBusiness(reqBody)
    if (!createBusiness.status) {
      return appHelper.apiResponse(200, false, createBusiness.data, "failed to save business");
    }
    return appHelper.apiResponse(200, true, "success", createBusiness.data);
  }
  catch (error) {
    console.log("login failed with error", error);
    return appHelper.apiResponse(500, false, "failed to login", error.message ? error.message : error);
  }
};

businessController.getAllBusiness = async (req) => {
  try {
    let getAllBusiness = await businessDal.findBusiness(req)
    if (!getAllBusiness.status) {
      return appHelper.apiResponse(200, false, "failed to get business", "failed to get business");
    }
    return appHelper.apiResponse(200, true, "success", getAllBusiness.data);
  } catch (error) {
    console.log(" Failed", error);
    return appHelper.apiResponse(500, false, error.message ? error.message : "internal server error");
  }
};



businessController.recommendedBusiness = async (req) => {
  try {
    let reqQuery = req.query;
    if(!reqQuery.location && reqQuery.nearBy == 'true'){
      return appHelper.apiResponse(200, false, "location is required", "location is required");
    }
    req.query.nearBy = 'true'
    let getBusinessWithLocation = await businessDal.findBusinessCopy(req);
    // delete req.query.location;
    // delete req.query.nearBy;
    let allBusiness = await businessDal.findBusinessCopy(req);
    req.query.recommended = "true";
    let recommendedBusiness = await businessDal.findBusinessCopy(req);
    let res = {
      allBusiness : allBusiness.data,
      recommendedBusiness : recommendedBusiness.data,
      businessBasedLocation : getBusinessWithLocation.data
    }
    return appHelper.apiResponse(200, true, "success", res);
  } catch (error) {
    console.log(" Failed", error);
    return appHelper.apiResponse(500, false, error.message ? error.message : "internal server error");
  }
};

businessController.getMyBusiness = async (req) => {
  try {
    let getAllBusiness = await businessDal.myBusiness(req)
    if (!getAllBusiness.status) {
      return appHelper.apiResponse(200, false, "No business found", []);
    }
    return appHelper.apiResponse(200, true, "success", getAllBusiness.data);
  } catch (error) {
    console.log(" Failed", error);
    return appHelper.apiResponse(500, false, error.message ? error.message : "internal server error");
  }
};

businessController.getBusinessDetails = async (req) => {
  try {
    let userId = req.user._id;
    let businessId = req.params.businessId
    let getBusinessDetails = await businessDal.findBusinessDetails(businessId)
    if (!getBusinessDetails.status) {
      return appHelper.apiResponse(200, false, "failed to get business details", "failed to get business details");
    }
    let newPortfolioImageArray = []
    let portfolioImageData = getBusinessDetails.data.portfolioImages || []
    let likesData = getBusinessDetails.data.likes || []
    let commentsData = getBusinessDetails.data.comments || []
    for (const portfolioImage of portfolioImageData) {
      let urlSplit = portfolioImage.split("/")
      let _id = urlSplit[5]
      let comments = commentsData.filter(e => (e.imageId && e.imageId.toString() === _id.toString()))
      let likes = likesData.filter(e => (e.imageId && e.imageId.toString() === _id.toString()))
      newPortfolioImageArray.push({
        _id: _id,
        url: portfolioImage,
        likeCount: likes.length,
        commentCount: comments.length,
        liked: likes.find(e => (e.imageId && e.userId.toString() === userId.toString() && e.liked === true)) ? true : false
      })
    }
    getBusinessDetails.data.portfolioImages = newPortfolioImageArray;
    delete  getBusinessDetails.data.likes;
    delete  getBusinessDetails.data.comments;
    return appHelper.apiResponse(200, true, "success", getBusinessDetails.data);
  } catch (error) {
    console.log(" Failed", error);
    return appHelper.apiResponse(500, false, error.message ? error.message : "internal server error");
  }
};

businessController.updateBusiness = async (req) => {
  try {
    let businessId = req.params.businessId
    let reqBody = req.body
    reqBody.updatedById = req.user._id;
    let updateBusiness = await businessDal.findBusinessByIdAndUpdate(businessId, reqBody)
    if (!updateBusiness.status) {
      return appHelper.apiResponse(200, false, "failed to update business details", "failed to update business details");
    }
    return appHelper.apiResponse(200, true, "success", updateBusiness.data);
  } catch (error) {
    console.log(" Failed", error);
    return appHelper.apiResponse(500, false, error.message ? error.message : "internal server error");
  }
};


businessController.deleteBusiness = async (req) => {
  try {
    let businessId = req.params.businessId
    let deleteBusiness = await businessDal.deleteBusinessById(businessId)
    if (!deleteBusiness.status) {
      return appHelper.apiResponse(200, false, "failed to delete business", "failed to delete business");
    }
    return appHelper.apiResponse(200, true, "business Deleted");
  } catch (error) {
    console.log(" Failed", error);
    return appHelper.apiResponse(500, false, error.message ? error.message : "internal server error");
  }
};



businessController.searchBusinessAndCategories = async (req) => {
  try {
    let searchBusiness = await businessDal.searchBusiness(req)
    if (!searchBusiness.status) {
      return appHelper.apiResponse(200, false, "failed to get business", "failed to get business");
    }
    let searchCategories = await categoryDal.searchCategories(req)
    if (!searchCategories.status) {
      return appHelper.apiResponse(200, false, "failed to get categories", "failed to get business");
    }

    let res = {
      business: searchBusiness.data || [],
      categories: searchCategories.data || []
    }
    return appHelper.apiResponse(200, true, "success", res);
  } catch (error) {
    console.log(" Failed", error);
    return appHelper.apiResponse(500, false, error.message ? error.message : "internal server error");
  }
};


module.exports = businessController;
