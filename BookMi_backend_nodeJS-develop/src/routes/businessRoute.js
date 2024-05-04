const express = require("express");
const businessController = require("../controllers/businessController");
const businessServiceController = require("../controllers/businessServiceController");
const businessHolidayController = require("../controllers/businessHolidayController");
const businessBookingController = require("../controllers/businessBookingController");
const genericController = require("../controllers/genericController");
const businessRoute = express.Router();

businessRoute
  .route("/")
  .get(async (req, res) => {
    let result = await businessController.getAllBusiness(req);
    res.status(result.code).send(result);
  })
  .post(async (req, res) => {
    let result = await businessController.createBusiness(req);
    res.status(result.code).send(result);
  })

businessRoute
  .route("/recommendedBusiness")
  .get(async (req, res) => {
    let result = await businessController.recommendedBusiness(req);
    res.status(result.code).send(result);
  })

businessRoute
  .route("/my")
  .get(async (req, res) => {
    let result = await businessController.getMyBusiness(req);
    res.status(result.code).send(result);
  })


businessRoute
  .route("/search")
  .get(async (req, res) => {
    let result = await businessController.searchBusinessAndCategories(req);
    res.status(result.code).send(result);
  })

businessRoute
  .route("/like")
  .post(async (req, res) => {
    let result = await genericController.likePortfolioImage(req);
    res.status(result.code).send(result);
  })
businessRoute
  .route("/report")
  .post(async (req, res) => {
    let result = await genericController.reportBusiness(req);
    res.status(result.code).send(result);
  })

businessRoute
  .route("/comment")
  .post(async (req, res) => {
    let result = await genericController.commentPortfolioImage(req);
    res.status(result.code).send(result);
  })
businessRoute
  .route("/comment/:businessId/:portfolioId")
  .get(async (req, res) => {
    let result = await genericController.getCommentForPortfolioImage(req);
    res.status(result.code).send(result);
  })
// businessRoute
//   .route("/rate")
//   .post(async (req, res) => {
//     let result = await genericController.rateBusiness(req);
//     res.status(result.code).send(result);
//   })
businessRoute
  .route("/review")
  .post(async (req, res) => {
    let result = await genericController.postBusinessReview(req);
    res.status(result.code).send(result);
  })
businessRoute
  .route("/review/:reviewId")
  .put(async (req, res) => {
    let result = await genericController.updateBusinessReview(req);
    res.status(result.code).send(result);
  })
businessRoute
  .route("/review/:businessId")
  .get(async (req, res) => {
    let result = await genericController.getBusinessReviewData(req);
    res.status(result.code).send(result);
  })

businessRoute
  .route("/:businessId")
  .get(async (req, res) => {
    let result = await businessController.getBusinessDetails(req);
    res.status(result.code).send(result);
  })
  .put(async (req, res) => {
    let result = await businessController.updateBusiness(req);
    res.status(result.code).send(result);
  })
  .delete(async (req, res) => {
    let result = await businessController.deleteBusiness(req);
    res.status(result.code).send(result);
  })

businessRoute
  .route("/:businessId")
  .get(async (req, res) => {
    let result = await businessController.getBusinessDetails(req);
    res.status(result.code).send(result);
  })
  .put(async (req, res) => {
    let result = await businessController.updateBusiness(req);
    res.status(result.code).send(result);
  })
  .delete(async (req, res) => {
    let result = await businessController.deleteBusiness(req);
    res.status(result.code).send(result);
  })




businessRoute
  .route("/:businessId/services")
  .post(async (req, res) => {
    let result = await businessServiceController.createBusinessServiceMany(req);
    res.status(result.code).send(result);
  })
  .get(async (req, res) => {
    let result = await businessServiceController.getServiceDetailsBusinessId(req);
    res.status(result.code).send(result);
  })

businessRoute
  .route("/:businessId/holiday")
  .get(async (req, res) => {
    let result = await businessHolidayController.getBusinessHolidays(req);
    res.status(result.code).send(result);
  })
  .post(async (req, res) => {
    let result = await businessHolidayController.createBusinessHolidays(req);
    res.status(result.code).send(result);
  })
  businessRoute
    .route("/:businessId/holiday/:holidayId")
  .put(async (req, res) => {
    let result = await businessHolidayController.updateBusinessHoliday(req);
    res.status(result.code).send(result);
  })
  .delete(async (req, res) => {
    let result = await businessHolidayController.deleteBusinessHoliday(req);
    res.status(result.code).send(result);
  })


businessRoute
  .route("/:businessId/service/:serviceId/slots")
  .get(async (req, res) => {
    let result = await businessServiceController.getBusinessSlots(req);
    res.status(result.code).send(result);
  })



module.exports = businessRoute;
