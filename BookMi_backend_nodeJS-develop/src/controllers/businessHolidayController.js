const businessHolidayController = new Object();
const appHelper = require("../helpers/appHelper");
const businessHolidayDal = require("../dal/businessHolidayDal");
const ObjectId = require('mongoose').Types.ObjectId;
const moment = require('moment-timezone');

businessHolidayController.createBusinessHolidays = async (req) => {
  try {
    let reqBody = req.body
    reqBody.businessId = ObjectId(req.params.businessId)
    reqBody.createdById = req.user._id
    let createBusinessHolidays = await businessHolidayDal.createHoliday(reqBody)
    if (!createBusinessHolidays.status) {
      return appHelper.apiResponse(200, false, "failed to save businessHolidays", "failed to save businessHolidays");
    }
    return appHelper.apiResponse(200, true, "success", createBusinessHolidays.data);
  }
  catch (error) {
    console.log("login failed with error", error);
    return appHelper.apiResponse(500, false, "failed to login", error.message ? error.message : error);
  }
};


businessHolidayController.getBusinessHolidays = async (req) => {
  try {
    let businessId = req.params.businessId
    let getBusinessHolidayDetails = await businessHolidayDal.getHolidaysForBusiness(businessId)
    if (!getBusinessHolidayDetails.status) {
      return appHelper.apiResponse(200, false, "failed to get businessHoliday details", "failed to get businessHoliday details");
    }
    return appHelper.apiResponse(200, true, "success", getBusinessHolidayDetails.data);
  } catch (error) {
    console.log(" Failed", error);
    return appHelper.apiResponse(500, false, error.message ? error.message : "internal server error");
  }
};



businessHolidayController.updateBusinessHoliday = async (req) => {
  try {
    let holidayId = req.params.holidayId
    let reqBody = req.body
    reqBody.updatedById = req.user._id
    let updateBusinessHoliday = await businessHolidayDal.findHolidayAndUpdate(holidayId, reqBody)
    if (!updateBusinessHoliday.status) {
      return appHelper.apiResponse(200, false, "failed to update businessHoliday details", "failed to update businessHoliday details");
    }
    return appHelper.apiResponse(200, true, "success", updateBusinessHoliday.data);
  } catch (error) {
    console.log(" Failed", error);
    return appHelper.apiResponse(500, false, error.message ? error.message : "internal server error");
  }
};


businessHolidayController.deleteBusinessHoliday = async (req) => {
  try {
    let holidayId = req.params.holidayId
    let deleteBusinessHoliday = await businessHolidayDal.deleteHolidayForBusiness(holidayId);
    if (!deleteBusinessHoliday.deletedCount) {
      return appHelper.apiResponse(200, false, "failed to delete business Holiday", "failed to delete business Holiday");
    }
    return appHelper.apiResponse(200, true, "Deleted!!");
  } catch (error) {
    console.log(" Failed", error);
    return appHelper.apiResponse(500, false, error.message ? error.message : "internal server error");
  }
};



module.exports = businessHolidayController;
