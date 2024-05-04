const express = require("express");
const accountController = require("../controllers/accountController");
const genericController = require("../controllers/genericController");
const accountRoute = express.Router();


accountRoute
  .route("/check/email")
  .post(async (req, res) => {
    let result = await accountController.checkEmail(req);
    res.status(result.code).send(result);
  })

accountRoute
  .route("/login")
  .post(async (req, res) => {
    let result = await accountController.login(req);
    res.status(result.code).send(result);
  })

accountRoute
  .route("/register")
  .post(async (req, res) => {
    let result = await accountController.register(req);
    res.status(result.code).send(result);
  })

accountRoute
  .route("/delete")
  .delete(async (req, res) => {
    let result = await accountController.deleteAccount(req);
    res.status(result.code).send(result);
  })

accountRoute
  .route("/my/review")
  .get(async (req, res) => {
    let result = await genericController.getMyReview(req);
    res.status(result.code).send(result);
  })
// accountRoute
//   .route("/my/review/:reviewId")
//   .put(async (req, res) => {
//     let result = await genericController.getMyReview(req);
//     res.status(result.code).send(result);
//   })
//   .delete(async (req, res) => {
//     let result = await genericController.getMyReview(req);
//     res.status(result.code).send(result);
//   })

accountRoute
  .route("/profile")
  .get(async (req, res) => {
    let result = await accountController.getMyProfileDetails(req);
    res.status(result.code).send(result);
  })
  .put(async (req, res) => {
    let result = await accountController.updateMyProfile(req);
    res.status(result.code).send(result);
  })
accountRoute
  .route("/forgot/password")
  .post(async (req, res) => {
    let result = await accountController.forgotPasswordUsingToken(req);
    res.status(result.code).send(result);
  })
accountRoute
  .route("/password/update")
  .post(async (req, res) => {
    let result = await accountController.updateMyPassword(req);
    res.status(result.code).send(result);
  })

accountRoute
  .route("/password/forgot")
  .post(async (req, res) => {
    let result = await accountController.forgotPassword(req);
    res.status(result.code).send(result);
  })
accountRoute
  .route("/password_reset/:accountId/:token")
  .post(async (req, res) => {
    let result = await accountController.resetPassword(req);
    res.status(result.code).send(result);
  })

module.exports = accountRoute;
