const serviceSchema = require("../models/service");
const serviceDal = new Object();
const mongoose = require('mongoose');

serviceDal.saveService = async (data) => {
  try {
    let service = new serviceSchema(data);
    let result = await service.save();
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

serviceDal.findServices = async (req) => {
  try {
    let categoryId = req.params.categoryId
    let result = await serviceSchema.find({ deleted: false, category: mongoose.Types.ObjectId(categoryId) });
    if (result) {
      return { status: true, data: result }
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to fetch clogs", error);
    return { status: false, data: error.message ? error.message : error }
  }
}

serviceDal.findServiceDetails = async (id) => {
  try {
    let result = await serviceSchema.findById(id);
    if (result) {
      return { status: true, data: result }
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to fetch clogs", error);
    return { status: false, data: error.message ? error.message : error }
  }
}

serviceDal.findServiceByIdAndUpdate = async (id, data) => {
  try {
    let result = await serviceSchema.findByIdAndUpdate(id, data, { new: true })
    if (result) {
      return { status: true, data: result };
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to save Users", error);
    return { status: false, data: error.message ? error.message : error }

  }
}

serviceDal.deleteServiceById = async (id) => {
  try {
    let result = await serviceSchema.findByIdAndDelete(id);
    if (result) {
      return { status: true, data: result }
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to fetch clogs", error);
    return { status: false, data: error.message ? error.message : error }
  }
}

module.exports = serviceDal;