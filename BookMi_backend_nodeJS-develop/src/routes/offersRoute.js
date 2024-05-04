const express = require("express");
const offerController = require("../controllers/offerController");
const offerRoute = express.Router();

offerRoute
  .route("/")
  .post(async (req, res) => {
    let result = await offerController.createOffer(req);
    res.status(result.code).send(result);
  })


offerRoute
  .route("/apply")
  .post(async (req, res) => {
    let result = await offerController.applyOffer(req);
    res.status(result.code).send(result);
  })


offerRoute
  .route("/:offerId")
  .get(async (req, res) => {
    let result = await offerController.getOfferDetails(req);
    res.status(result.code).send(result);
  })
  .put(async (req, res) => {
    let result = await offerController.updateOffer(req);
    res.status(result.code).send(result);
  })
  .delete(async (req, res) => {
    let result = await offerController.deleteOffer(req);
    res.status(result.code).send(result);
  })

module.exports = offerRoute;
