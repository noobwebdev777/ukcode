const businessSchema = require("../models/business");
const businessDal = new Object();
const serviceDal = require("./businessServiceDal")
const ObjectId = require('mongoose').Types.ObjectId

businessDal.saveBusiness = async (data) => {
  try {
    let business = new businessSchema(data);
    let result = await business.save();
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

businessDal.findBusiness = async (req) => {
  try {
    let reqQuery = req.query;
    let query = [{ deleted: false }]
    let orArray = []
    if (reqQuery.city) {
      let value = String(reqQuery.city).replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1');
      query.push({ 'address.city': { $regex: '.*' + value + '.*', $options: 'i' } })
    }
    if (reqQuery.categoryId) {
      let business = await serviceDal.getBusinessByCategory(reqQuery.categoryId)
      let businessIds = []
      business.data.map(e => businessIds.push(e.businessId))
      businessIds.push(ObjectId(reqQuery.categoryId))
      if (businessIds.length > 0) {
        query.push({ $or: [{ categoryId: ObjectId(reqQuery.categoryId) }, { _id: { $in: businessIds } }] })
      } else {
        query.push({ categoryId: ObjectId(reqQuery.categoryId) })
      }
    }
    if(reqQuery.date){
      let day = new Date(reqQuery.date).getDay();
      let businessIds = []
      let getBusiness = await getBusinessIdBasedOnBusinessWorkingDate(day);
      for (const business of getBusiness) {
        businessIds.push(business._id)
      }
      query.push({ _id: { $in: businessIds } })
    }
    if (reqQuery.businessName) {
      let value = String(reqQuery.businessName).replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1');
      orArray.push({ businessName: { $regex: '.*' + value + '.*', $options: 'i' } })
      let businessService = await serviceDal.searchService(reqQuery.businessName)
      let businessIds = []
      businessService.data.map(e => businessIds.push(e.businessId))
      if (businessIds.length > 0) orArray.push({ _id: { $in: businessIds } })
      query.push({ $or: orArray })
    }
    if (reqQuery.rating) {
      let businessIds = []
      let getBusiness = await getBusinessIdBasedOnRating();
      for (const business of getBusiness) {
        if (business.ratingStar >= Number(reqQuery.rating)) {
          businessIds.push(business._id)
        }
      }
      query.push({ _id: { $in: businessIds } })
    }
    let result = businessSchema.aggregate()
    if (reqQuery.location && reqQuery.nearBy == 'true') {
      let loc = reqQuery.location.split(",")
      loc = loc.map(e => Number(e));
      result = result.near({
        includeLocs: "location",
        distanceField: "distance",
        near: { type: 'Point', coordinates: loc },
        maxDistance: 50000,
        spherical: true
      })
    }
    result = result.match({ $and: query })
      .sort({ distance: 1 })
      .lookup({ from: "businessservices", localField: "_id", foreignField: "businessId", as: "services" })
      .lookup({ from: "offers", localField: "_id", foreignField: "businessId", as: "offers" })
      .addFields({ 'flashSale': { '$filter': { 'input': '$offers', 'as': 'offers', 'cond': { '$eq': ['$$offers.type', 'Flash_Sale'] } } } })
      .addFields({ 'happyHours': { '$filter': { 'input': '$offers', 'as': 'offers', 'cond': { '$eq': ['$$offers.type', 'Happy_hours'] } } } })
      .addFields({ 'lastMinuteDiscount': { '$filter': { 'input': '$offers', 'as': 'offers', 'cond': { '$eq': ['$$offers.type', 'Last_Minute_Discount'] } } } })
      .lookup({ from: "likes", localField: "_id", foreignField: "businessId", as: "likes" })
      .lookup({ from: "reviews", localField: "_id", foreignField: "businessId", as: "comments" })
      .project({
        _id: 1,
        businessName: 1,
        businessLogo: 1,
        businessCover: 1,
        businessMobile: 1,
        description: 1,
        ownerName: 1,
        categoryId: 1,
        atMyPlace: 1,
        atClientPlace: 1,
        address: 1,
        travelFees: 1,
        openHours: 1,
        images: 1, 
        portfolioImages: 1,
        offers: 1,
        flashSale: 1,
        lastMinuteDiscount: 1,
        happyHours: 1, 
        likes: { $size: '$likes' },
        comments: { $size: '$comments' },
        ratingCount: { $size: '$comments' },
        ratingStar: { $round: [{ $avg: "$comments.rating" }, 2] },
        distance: { $round: [ { $divide: [ "$distance", 1000 ] } , 1 ] }
      })

    result = await result.exec()
    if (result) {
      return { status: true, data: result }
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to fetch clogs", error);
    return { status: false, data: error.message ? error.message : error }
  }
}


businessDal.findBusinessCopy = async (req, additionalFilter) => {
  try {
    let reqQuery = req.query;
    let query = [{ deleted: false }]
    if (additionalFilter) {
      query.push(additionalFilter)
    };
    if (reqQuery.recommended) {
      query.push({ recommended: true })
    };
    let result = businessSchema.aggregate()
    if (reqQuery.location && reqQuery.nearBy == 'true') {
      let loc = reqQuery.location.split(",")
      loc = loc.map(e => Number(e));
      result = result.near({
        includeLocs: "location",
        distanceField: "distance",
        near: { type: 'Point', coordinates: loc },
        maxDistance: 50000,
        spherical: true
      })
    }
    result = result.match({ $and: query })
      .sort({ distance: 1 })
      .limit(20)
      .lookup({ from: "businessservices", localField: "_id", foreignField: "businessId", as: "services" })
      .lookup({ from: "likes", localField: "_id", foreignField: "businessId", as: "likes" })
      .lookup({ from: "reviews", localField: "_id", foreignField: "businessId", as: "comments" })
      .lookup({ from: "offers", localField: "_id", foreignField: "businessId", as: "offers" })
      .addFields({ 'flashSale': { '$filter': { 'input': '$offers', 'as': 'offers', 'cond': { '$eq': ['$$offers.type', 'Flash_Sale'] } } } })
      .addFields({ 'happyHours': { '$filter': { 'input': '$offers', 'as': 'offers', 'cond': { '$eq': ['$$offers.type', 'Happy_hours'] } } } })
      .addFields({ 'lastMinuteDiscount': { '$filter': { 'input': '$offers', 'as': 'offers', 'cond': { '$eq': ['$$offers.type', 'Last_Minute_Discount'] } } } })
      .project({
        _id: 1,
        businessName: 1,
        businessLogo: 1,
        businessCover: 1,
        businessMobile: 1,
        description: 1,
        ownerName: 1,
        categoryId: 1,
        atMyPlace: 1,
        atClientPlace: 1,
        address: 1,
        travelFees: 1,
        openHours: 1,
        images: 1, 
        portfolioImages: 1,
        offers: 1,
        flashSale: 1,
        lastMinuteDiscount: 1,
        happyHours: 1, 
        likes: { $size: '$likes' },
        comments: { $size: '$comments' },
        ratingCount: { $size: '$comments' },
        ratingStar: { $round: [{ $avg: "$comments.rating" }, 2] },
        distance: { $round: [ { $divide: [ "$distance", 1000 ] } , 1 ] }
      })

    result = await result.exec()
    if (result) {
      return { status: true, data: result }
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to fetch clogs", error);
    return { status: false, data: error.message ? error.message : error }
  }
}

businessDal.myBusiness = async (req) => {
  try {
    let reqQuery = req.query;
    let query = [{ deleted: false, belongTo: ObjectId(req.user._id) }]
    if (reqQuery.city) {
      let value = String(reqQuery.city).replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1');
      query.push({ 'address.city': { $regex: '.*' + value + '.*', $options: 'i' } })
    }
    if (reqQuery.categoryId) {
      query.push({ categoryId: ObjectId(reqQuery.categoryId) })
    }
    if (reqQuery.businessName) {
      let value = String(reqQuery.businessName).replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1');
      query.push({ businessName: { $regex: '.*' + value + '.*', $options: 'i' } })
    }
    if (reqQuery.rating && reqQuery.rating != 5) {
      query.push({ businessName: `~~~~~~~~~` })
    }
    let result = await businessSchema.aggregate()
      .match({ $and: query })
      .lookup({ from: "businessservices", localField: "_id", foreignField: "businessId", as: "services" })
      .lookup({ from: "offers", localField: "_id", foreignField: "businessId", as: "offers" })
      .addFields({ 'flashSale': { '$filter': { 'input': '$offers', 'as': 'offers', 'cond': { '$eq': ['$$offers.type', 'Flash_Sale'] } } } })
      .addFields({ 'happyHours': { '$filter': { 'input': '$offers', 'as': 'offers', 'cond': { '$eq': ['$$offers.type', 'Happy_hours'] } } } })
      .addFields({ 'lastMinuteDiscount': { '$filter': { 'input': '$offers', 'as': 'offers', 'cond': { '$eq': ['$$offers.type', 'Last_Minute_Discount'] } } } })
      .lookup({ from: "likes", localField: "_id", foreignField: "businessId", as: "likes" })
      .lookup({ from: "comments", localField: "_id", foreignField: "businessId", as: "comments" })
      .project({
        _id: 1,
        businessName: 1,
        businessMobile: 1,
        businessLogo: 1,
        businessCover: 1,
        description: 1,
        ownerName: 1,
        categoryId: 1,
        atMyPlace: 1,
        atClientPlace: 1,
        address: 1,
        travelFees: 1,
        openHours: 1,
        images: 1, 
        services: 1,
        portfolioImages: 1,
        offers: 1,
        flashSale: 1,
        lastMinuteDiscount: 1,
        happyHours: 1, 
        likes: { $size: '$likes' },
        comments: { $size: '$comments' },
        ratingCount: { $size: '$comments' },
        ratingStar: { $round: [{ $avg: "$comments.rating" }, 2] },
      })
      .exec()
    if (result.length > 0) {
      return { status: true, data: result }
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to fetch clogs", error);
    return { status: false, data: error.message ? error.message : error }
  }
}

businessDal.findBusinessDetails = async (id) => {
  try {
    let result = await businessSchema.aggregate()
      .match({ deleted: false, _id: ObjectId(id) })
      .lookup({ from: "businessservices", localField: "_id", foreignField: "businessId", as: "services" })
      .lookup({ from: "offers", localField: "_id", foreignField: "businessId", as: "offers" })
      .addFields({ 'flashSale': { '$filter': { 'input': '$offers', 'as': 'offers', 'cond': { '$eq': ['$$offers.type', 'Flash_Sale'] } } } })
      .addFields({ 'happyHours': { '$filter': { 'input': '$offers', 'as': 'offers', 'cond': { '$eq': ['$$offers.type', 'Happy_hours'] } } } })
      .addFields({ 'lastMinuteDiscount': { '$filter': { 'input': '$offers', 'as': 'offers', 'cond': { '$eq': ['$$offers.type', 'Last_Minute_Discount'] } } } })
      .lookup({ from: "likes", localField: "_id", foreignField: "businessId", as: "likes" })
      .lookup({ from: "comments", localField: "_id", foreignField: "businessId", as: "comments" })
      .project({
        _id: 1,
        businessName: 1,
        businessMobile: 1,
        businessLogo: 1,
        businessCover: 1,
        description: 1,
        ownerName: 1,
        categoryId: 1,
        atMyPlace: 1,
        atClientPlace: 1,
        address: 1,
        travelFees: 1,
        openHours: 1,
        images: 1, 
        services: 1,
        portfolioImages: 1,
        likes: 1,
        offers: 1,
        flashSale: 1,
        lastMinuteDiscount: 1,
        happyHours: 1, 
        comments: 1
      })
      .exec()
    if (result.length > 0) {
      return { status: true, data: result[0] }
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to fetch clogs", error);
    return { status: false, data: error.message ? error.message : error }
  }
}

businessDal.findBusinessByIdAndUpdate = async (id, data) => {
  try {
    let result = await businessSchema.findByIdAndUpdate(id, data, { new: true })
    if (result) {
      return { status: true, data: result };
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to save Users", error);
    return { status: false, data: error.message ? error.message : error }

  }
}

businessDal.deleteBusinessById = async (id) => {
  try {
    let result = await businessSchema.findByIdAndDelete(id);
    if (result) {
      return { status: true, data: result }
    }
    return { status: false, data: result }
  } catch (error) {
    console.log("failed to fetch clogs", error);
    return { status: false, data: error.message ? error.message : error }
  }
}

businessDal.searchBusiness = async (req) => {
  try {
    let reqQuery = req.query;
    let query = [{ deleted: false }]
    if (reqQuery.city) {
      let value = String(reqQuery.city).replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1');
      query.push({ 'address.city': { $regex: '.*' + value + '.*', $options: 'i' } })
    }
    if (reqQuery.keyword) {
      let value = String(reqQuery.keyword).replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1');
      query.push({ 'businessName': { $regex: '.*' + value + '.*', $options: 'i' } })
    }
    let result = await businessSchema.aggregate()
      .match({ $and: query })
      .limit(10)
      .project({
        _id: 1,
        businessName: 1,
        businessMobile: 1,
        ownerName: 1,
        address: 1,
      })
      .exec()
    return { status: true, data: result }
  } catch (error) {
    console.log("failed to fetch clogs", error);
    return { status: false, data: error.message ? error.message : error }
  }
}

const getBusinessIdBasedOnRating = async() => {
  let result = await businessSchema.aggregate()
    .lookup({ from: "reviews", localField: "_id", foreignField: "businessId", as: "comments" })
    .project({
      _id: 1,
      ratingStar: { $round: [{ $avg: "$comments.rating" }, 2] },
    })
    return result
}


const getBusinessIdBasedOnBusinessWorkingDate = async (day) => {
  let result = await businessSchema.find({
    openHours: {
      $elemMatch: {
        dayOfWeek: day,
        openFrom: { $ne: "" },
        openTill: { $ne: "" }
      }
    }
  })
  return result
}


businessDal.deleteAllBusinessForUser = async (accountId) => {
  try {
    return businessSchema.deleteMany({ createdById: accountId })
  } catch (error) {
    console.log(error);
    return { status: false, data: error.message ? error.message : error }
  }
}

module.exports = businessDal;