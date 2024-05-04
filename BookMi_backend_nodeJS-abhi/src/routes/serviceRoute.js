const express = require("express");
const serviceController = require("../controllers/serviceController");
const serviceRoute = express.Router();

serviceRoute
  .route("/")
  .get(async (req, res) => {
    let result = await serviceController.checkEmail(req);
    res.status(result.code).send(result);
  })
  .post(async (req, res) => {
    let result = await serviceController.checkEmail(req);
    res.status(result.code).send(result);
  })

serviceRoute
  .route("/serviceId")
  .get(async (req, res) => {
    let result = await serviceController.checkEmail(req);
    res.status(result.code).send(result);
  })
  .put(async (req, res) => {
    let result = await serviceController.checkEmail(req);
    res.status(result.code).send(result);
  })
  .delete(async (req, res) => {
    let result = await serviceController.checkEmail(req);
    res.status(result.code).send(result);
  })

module.exports = serviceRoute;
