const fileSchema = require("../models/file");
const fileDal = new Object();

fileDal.createFile = async (data) => {
  try {
    let file = await new fileSchema(data).save();
    if (!file) {
      return { status: false, message: file.message };
    }
    return { status: true, data: file };
  } catch (error) {
    console.log(" Failed", error);
    return { status: false, data: error.message ? error.message : error };
  }
};

fileDal.getFileById = async (id) => {
  try {
    let file = await fileSchema.findById(id);
    if (!file) {
      return { status: false, message: file };
    }
    return { status: true, data: file };
  } catch (error) {
    console.log(" Failed", error);
    return { status: false, data: error.message ? error.message : error };
  }
};

fileDal.deleteFileById = async (id) => {
  try {
    let result = await fileSchema.findByIdAndDelete(id);
    if (result) {
      return { status: true, data: result }
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to fetch clogs", error);
    return { status: false, data: error.message ? error.message : error }
  }
}

fileDal.deleteAllFileForUser = async (accountId) => {
  try {
    return fileSchema.deleteMany({ uploadedById: accountId })
  } catch (error) {
    console.log(error);
    return { status: false, data: error.message ? error.message : error }
  }
}

module.exports = fileDal;