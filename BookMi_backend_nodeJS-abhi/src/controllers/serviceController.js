const serviceController = new Object();
const appHelper = require("../helpers/appHelper");
const serviceDal = require("../dal/serviceDal");

serviceController.createService = async (req) => {
  try {
    let reqBody = req.body;
    reqBody.category = req.params.categoryId;
    let createService = await serviceDal.saveService(reqBody)
    if(!createService.status){
      return appHelper.apiResponse(200, false, "failed to save service", "failed to save service");
    }
    return appHelper.apiResponse(200, true, "success", createService.data);
  }
  catch (error) {
    console.log("login failed with error", error);
    return appHelper.apiResponse(500, false, "failed to login", error.message ? error.message : error);
  }
};

serviceController.getAllServices = async (req) => {
  try {
    let getAllServices = await serviceDal.findServices(req)
    if(!getAllServices.status){
      return appHelper.apiResponse(200, false, "failed to get service", "failed to get service");
    }
    return appHelper.apiResponse(200, true, "success", getAllServices.data);
  } catch (error) {
    console.log(" Failed", error);
    return appHelper.apiResponse(500, false, error.message ? error.message : "internal server error");
  }
};

serviceController.getServiceDetails = async (req) => {
  try {
    let serviceId = req.params.serviceId
    let getServiceDetails = await serviceDal.findServiceDetails(serviceId)
    if(!getServiceDetails.status){
      return appHelper.apiResponse(200, false, "failed to get service details", "failed to get service details");
    }
    return appHelper.apiResponse(200, true, "success", getServiceDetails.data);
  } catch (error) {
    console.log(" Failed", error);
    return appHelper.apiResponse(500, false, error.message ? error.message : "internal server error");
  }
};

serviceController.updateService = async (req) => {
  try {
    let serviceId = req.params.serviceId
    let reqBody = req.body
    let updateService = await serviceDal.findServiceByIdAndUpdate(serviceId, reqBody)
    if(!updateService.status){
      return appHelper.apiResponse(200, false, "failed to get service details", "failed to get service details");
    }
    return appHelper.apiResponse(200, true, "success", updateService.data);
  } catch (error) {
    console.log(" Failed", error);
    return appHelper.apiResponse(500, false, error.message ? error.message : "internal server error");
  }
};


serviceController.deleteService = async (req) => {
  try {
    let serviceId = req.params.serviceId
    let deleteService = await serviceDal.deleteServiceById(serviceId)
    if(!deleteService.status){
      return appHelper.apiResponse(200, false, "failed to delete service", "failed to delete service");
    }
    return appHelper.apiResponse(200, true, "service Deleted");
  } catch (error) {
    console.log(" Failed", error);
    return appHelper.apiResponse(500, false, error.message ? error.message : "internal server error");
  }
};


module.exports = serviceController;
