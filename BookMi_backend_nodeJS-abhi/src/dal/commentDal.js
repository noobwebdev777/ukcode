const commentSchema = require("../models/commentSchema");
const commentDal = new Object();
const ObjectId = require('mongoose').Types.ObjectId;

commentDal.comment = async (data) => {
  try {
    let comment = new commentSchema(data);
    let result = await comment.save();
    if (result) {
      return { status: true, data: result };
    }
    return { status: false, data: result }
  } catch (error) {
    console.log(error);
    return { status: false, data: error.message ? error.message : error }
  }
}

commentDal.getCommentForPortfolioImage = async (businessId, imageId) => {
  try {
    let result = await commentSchema.aggregate()
      .match({ businessId: ObjectId(businessId), imageId: ObjectId(imageId)  })
      .lookup({ from: "accounts", localField: "userId", foreignField: "_id", as: "userDetails" })
      .unwind({ path: '$userDetails', preserveNullAndEmptyArrays: true })
      .project({
        _id: 1,
        comment: 1,
        createdAt: 1,
        userDetails:{
          name: 1
        }
      })
      .exec()
    return { status: true, data: result };
  } catch (error) {
    console.log(error);
    return { status: false, data: error.message ? error.message : error }
  }
}




commentDal.deleteAllCommentForUser = async (accountId) => {
  try {
    return commentSchema.deleteMany({ userId: accountId })
  } catch (error) {
    console.log(error);
    return { status: false, data: error.message ? error.message : error }
  }
}


module.exports = commentDal;