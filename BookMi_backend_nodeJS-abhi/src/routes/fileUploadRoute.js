const express = require("express");
const fileUploadController = require("../controllers/fileUploadController");
const fileUploadRoute = express.Router();

fileUploadRoute
  .route("/upload")
  .post(async (req, res) => {
    let result = await fileUploadController.uploadFile(req);
    res.status(result.code).send(result);
  })


fileUploadRoute
  .route("/:fileId")
  .get(async (req, res) => {
    let result = await fileUploadController.getFile(req);
    if (result.status) {
      res.type(result.data.type)
      res.send(Buffer.from(result.data.data, 'base64'));
    } else {
      res.status(result.code).send(result.data);
    }
  })
fileUploadRoute
  .route("/delete/:fileId")
  .delete(async (req, res) => {
    let result = await fileUploadController.deleteFile(req);
    res.status(result.code).send(result);
  })

module.exports = fileUploadRoute;