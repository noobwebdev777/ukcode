const deviceSchema = require("../models/device");
const mongoose = require('mongoose');
const deviceDal = new Object();
const ObjectId = require('mongoose').Types.ObjectId

deviceDal.saveDeviceIfNotExists = async (data) => {
  try {
    let query = {
      deviceId: data.deviceId,
      accountId: mongoose.Types.ObjectId(data.accountId)
    };
    let result = await deviceSchema.findOneAndUpdate(query, data, { upsert: true })
    if (result) {
      return { status: true, data: result };
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to save Users", error);
    return { status: false, data: error.message ? error.message : error }
  }
}


deviceDal.getDeviceForUser = async (accountId) => {
  try {
    let result = await deviceSchema.findOne({ accountId: ObjectId(accountId) }).sort({ updatedAt: -1 })
    if (result) {
      return { status: true, data: result };
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to save Users", error);
    return { status: false, data: error.message ? error.message : error }

  }
}



deviceDal.deleteAllDevicesForUser = async (accountId) => {
  try {
    return deviceSchema.deleteMany({ accountId: accountId })
  } catch (error) {
    console.log(error);
    return { status: false, data: error.message ? error.message : error }
  }
}



module.exports = deviceDal;