const businessServiceSchema = require("../models/businessService");
const businessServiceDal = new Object();
const ObjectId = require('mongoose').Types.ObjectId;

businessServiceDal.saveBusinessService = async (data) => {
  try {
    let businessService = new businessServiceSchema(data);
    let result = await businessService.save();
    if (result) {
      return { status: true, data: result };
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to save Users", error);
    if (error.code == '11000') {
      return { status: false, message: `${Object.keys(error.keyValue)[0]} is already taken` }
    } else {
      return { status: false, data: error.message ? error.message : error }
    }
  }
}

businessServiceDal.saveMultipleBusinessService = async (data) => {
  try {
    let result = await businessServiceSchema.insertMany(data);
    if (result) {
      return { status: true, data: result };
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to save Users", error);
    if (error.code == '11000') {
      return { status: false, message: `${Object.keys(error.keyValue)[0]} is already taken` }
    } else {
      return { status: false, data: error.message ? error.message : error }
    }
  }
}


businessServiceDal.findBusinessServiceDetails = async (id) => {
  try {
    let result = await businessServiceSchema.findById(id).populate('businessId');
    if (result) {
      return { status: true, data: result }
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to fetch clogs", error);
    return { status: false, data: error.message ? error.message : error }
  }
}

businessServiceDal.findServiceDetailsBusinessId = async (businessId) => {
  try {
    let result = await businessServiceSchema.find({ businessId: ObjectId(businessId) }).populate('businessId', 'businessName').populate('categoryId', 'name');
    if (result) {
      return { status: true, data: result }
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to fetch clogs", error);
    return { status: false, data: error.message ? error.message : error }
  }
}

businessServiceDal.findBusinessServiceByIdAndUpdate = async (id, data) => {
  try {
    let result = await businessServiceSchema.findByIdAndUpdate(id, data, { new: true })
    if (result) {
      return { status: true, data: result };
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to save Users", error);
    return { status: false, data: error.message ? error.message : error }

  }
}

businessServiceDal.deleteBusinessServiceById = async (id) => {
  try {
    let result = await businessServiceSchema.findByIdAndDelete(id);
    if (result) {
      return { status: true, data: result }
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to fetch clogs", error);
    return { status: false, data: error.message ? error.message : error }
  }
}

businessServiceDal.searchService = async (name) => {
  try {
    let value = String(name).replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1');
    let result = await businessServiceSchema.find({ name: { $regex: '.*' + value + '.*', $options: 'i' } }).select('businessId');
    if (result) {
      return { status: true, data: result }
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to fetch clogs", error);
    return { status: false, data: error.message ? error.message : error }
  }
}

businessServiceDal.getBusinessByCategory = async (categoryId) => {
  try {
    let result = await businessServiceSchema.find({ categoryId:  ObjectId(categoryId)  }).select('businessId');
    if (result) {
      return { status: true, data: result }
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to fetch clogs", error);
    return { status: false, data: error.message ? error.message : error }
  }
}


businessServiceDal.deleteAllBusinessServicesForUser = async (accountId) => {
  try {
    return businessServiceSchema.deleteMany({ createdById: accountId })
  } catch (error) {
    console.log(error);
    return { status: false, data: error.message ? error.message : error }
  }
}

module.exports = businessServiceDal;