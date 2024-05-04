const express = require("express");
const categoryController = require("../controllers/categoryController");
const serviceController = require("../controllers/serviceController");
const categoryRoute = express.Router();

categoryRoute
  .route("/")
  .get(async (req, res) => {
    let result = await categoryController.getAllCategory(req);
    res.status(result.code).send(result);
  })
  .post(async (req, res) => {
    let result = await categoryController.createCategory(req);
    res.status(result.code).send(result);
  })

categoryRoute
  .route("/:categoryId")
  .get(async (req, res) => {
    let result = await categoryController.getCategoryDetails(req);
    res.status(result.code).send(result);
  })
  .put(async (req, res) => {
    let result = await categoryController.updateCategory(req);
    res.status(result.code).send(result);
  })
  .delete(async (req, res) => {
    let result = await categoryController.deleteCategory(req);
    res.status(result.code).send(result);
  })

categoryRoute
  .route("/:categoryId/services")
  .get(async (req, res) => {
    let result = await serviceController.getAllServices(req);
    res.status(result.code).send(result);
  })
  .post(async (req, res) => {
    let result = await serviceController.createService(req);
    res.status(result.code).send(result);
  })


categoryRoute
  .route("/:categoryId/services/:serviceId")
  .get(async (req, res) => {
    let result = await serviceController.getServiceDetails(req);
    res.status(result.code).send(result);
  })
  .put(async (req, res) => {
    let result = await serviceController.updateService(req);
    res.status(result.code).send(result);
  })
  .delete(async (req, res) => {
    let result = await serviceController.deleteService(req);
    res.status(result.code).send(result);
  })

module.exports = categoryRoute;
