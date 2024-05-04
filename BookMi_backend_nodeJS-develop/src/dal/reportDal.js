const reportSchema = require("../models/reportModel");
const reportDal = new Object();
const ObjectId = require('mongoose').Types.ObjectId;

reportDal.reportBusiness = async (data) => {
  try {
    let report = new reportSchema(data);
    let result = await report.save();
    if (result) {
      return { status: true, data: result };
    }
    return { status: false, data: result }
  } catch (error) {
    console.log(error);
    return { status: false, data: error.message ? error.message : error }
  }
}


module.exports = reportDal;