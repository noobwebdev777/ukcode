const fileController = new Object();
const appHelper = require("../helpers/appHelper");
const fileDal = require("../dal/fileDal");
const config = require("../config/config");


fileController.uploadFile = async (req, res) => {
  try {
    let reqBody = req.body;
    reqBody.uploadedById = req.user._id
    let saveFile = await fileDal.createFile(reqBody)
    if (!saveFile.status) {
      return appHelper.apiResponse(200, false, "something went wrong on file upload");
    }
    let url = `${config.app.backendUrl}file/${saveFile.data._id}`
    return appHelper.apiResponse(200, true, "File uploaded!", { url: url });
  } catch (error) {
    console.log("File Failed to Upload", error);
    return appHelper.apiResponse(500, false, "failed to upload due to internal server error ");
  }
};


fileController.getFile = async (req, res) => {
  try {
    let fileId = req.params.fileId;
    let saveFile = await fileDal.getFileById(fileId)
    if (!saveFile.status) {
      return appHelper.apiResponse(400, false, "invalid file", "invalid file");
    }
    let file = saveFile.data;
    let resData = {
      data: file.fileData,
      type: file.mimeType
    }
    return appHelper.apiResponse(200, true, "File uploaded!", resData);
  } catch (error) {
    console.log("File Failed to Upload", error);
    return appHelper.apiResponse(500, false, "something went wrong");
  }
};


fileController.deleteFile = async (req, res) => {
  try {
    let fileId = req.params.fileId;
    let deleteFile = await fileDal.deleteFileById(fileId)
    if (!deleteFile.status) {
      return appHelper.apiResponse(400, false, "invalid file", "invalid file");
    }
    return appHelper.apiResponse(200, true, "File deleted!", {});
  } catch (error) {
    console.log("File Failed to Delete", error);
    return appHelper.apiResponse(500, false, "something went wrong");
  }
};


module.exports = fileController;