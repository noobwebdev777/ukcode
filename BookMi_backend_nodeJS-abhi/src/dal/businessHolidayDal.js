const holidaySchema = require("../models/businessHolidayModel");
const mongoose = require('mongoose');
const holidayDal = new Object();
const ObjectId = require('mongoose').Types.ObjectId

holidayDal.createHoliday = async (data) => {
  try {
    let holiday = new holidaySchema(data);
    let result = await holiday.save();
    if (result) {
      return { status: true, data: result };
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to save Users", error);
    return { status: false, data: error.message ? error.message : error }

  }
}


holidayDal.getHolidaysForBusiness = async (businessId) => {
  try {
    let result = await holidaySchema.find({ businessId: ObjectId(businessId) }).sort({ createdAt: -1 })
    if (result) {
      return { status: true, data: result };
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to save Users", error);
    return { status: false, data: error.message ? error.message : error }

  }
}


holidayDal.findBusinessHolidayForParticularDate = async (businessId, date) => {
  try {
    let startDate = new Date(new Date(date).setHours(0, 0, 0, 0))
    let endDate = new Date(new Date(date).setHours(23, 59, 59, 999))
    let result = await holidaySchema.find({ businessId: ObjectId(businessId), $or: [{ from: { $gte: startDate, $lte: endDate } }, { to: { $gte: startDate, $lte: endDate } }] }).sort({ createdAt: -1 });
    return { status: true, data: result };
  } catch (error) {
    console.log("failed to save Users", error);
    return { status: false, data: error.message ? error.message : error }

  }
}


holidayDal.findHolidayAndUpdate = async (id, data) => {
  try {
    let result = await holidaySchema.findByIdAndUpdate(id, data, { new: true })
    if (result) {
      return { status: true, data: result };
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to save Users", error);
    return { status: false, data: error.message ? error.message : error }

  }
}

holidayDal.deleteHolidayForBusiness = async (id) => {
  try {
    return holidaySchema.deleteOne({ _id: ObjectId(id) })
  } catch (error) {
    console.log(error);
    return { status: false, data: error.message ? error.message : error }
  }
}



module.exports = holidayDal;