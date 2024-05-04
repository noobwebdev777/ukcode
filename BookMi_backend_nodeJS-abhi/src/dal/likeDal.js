const likeSchema = require("../models/likeSchema");
const likeDal = new Object();
const ObjectId = require('mongoose').Types.ObjectId

likeDal.like = async (data) => {
  try {
    let query = { businessId: ObjectId(data.businessId), userId: ObjectId(data.userId) }
    if (data.imageId) {
      query.imageId = ObjectId(data.imageId)
    }
    let like = await likeSchema.findOneAndUpdate(query, data, { upsert: true, new: true });
    if (like) {
      return { status: true, data: like };
    }
    return { status: false, data: like }
  } catch (error) {
    console.log(error);
    return { status: false, data: error.message ? error.message : error }
  }
}


likeDal.deleteAllLikesForUser = async (accountId) => {
  try {
    return likeSchema.deleteMany({ userId: accountId })
  } catch (error) {
    console.log(error);
    return { status: false, data: error.message ? error.message : error }
  }
}

module.exports = likeDal;