const bookingSchema = require('../models/bookingModel')
const bookingDal = {}
const moment = require('moment-timezone')
const ObjectId = require('mongoose').Types.ObjectId

bookingDal.saveBooking = async (data) => {
    try {
        let booking = new bookingSchema(data)
        let result = await booking.save()
        if (result) {
            return { status: true, data: result }
        }
        return { status: false, message: result }
    } catch (error) {
        console.log(error)
        return {
            status: false,
            message: error.message ? error.message : 'error',
        }
    }
}

bookingDal.saveBulkBooking = async (data) => {
    try {
        let result = await bookingSchema.insertMany(data)
        if (result) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log(error)
        return { status: false, data: error.message ? error.message : error }
    }
}

bookingDal.getMyBookingForBusiness = async (businessId, userId) => {
    try {
        let result = await bookingSchema
            .findOne({
                businessId: ObjectId(businessId),
                bookedById: ObjectId(userId),
            })
            .sort({ createdAt: 1 })
            .lean()
        if (result) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log(error)
        return { status: false, data: error.message ? error.message : error }
    }
}

bookingDal.cancelBookingByBookingId = async (id) => {
    try {
        let result = await bookingSchema.findByIdAndUpdate(
            id,
            { status: 'CANCELLED' },
            { new: true }
        )
        if (result) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log(error)
        return { status: false, data: error.message ? error.message : error }
    }
}

bookingDal.finishedBookingByBookingId = async (id) => {
    try {
        let result = await bookingSchema.findByIdAndUpdate(
            id,
            { status: 'FINISHED' },
            { new: true }
        )
        if (result) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log(error)
        return { status: false, data: error.message ? error.message : error }
    }
}

bookingDal.getMyBookingData = async (bookedById) => {
    try {
        let query = [{ bookedById: ObjectId(bookedById) }]

        let result = await bookingSchema
            .aggregate()
            .match({ $and: query })
            .lookup({
                from: 'businesses',
                localField: 'businessId',
                foreignField: '_id',
                as: 'businessDetails',
            })
            .unwind({ path: '$services', preserveNullAndEmptyArrays: true })
            .lookup({
                from: 'businessservices',
                localField: 'services.serviceId',
                foreignField: '_id',
                as: 'services.serviceDetails',
            })
            .unwind({
                path: '$businessDetails',
                preserveNullAndEmptyArrays: true,
            })
            .unwind({
                path: '$services.serviceDetails',
                preserveNullAndEmptyArrays: true,
            })
            .group({
                _id: '$_id',
                status: { $first: '$status' },
                bookingId: { $first: '$bookingId' },
                businessDetails: { $first: '$businessDetails' },
                note: { $first: '$note' },
                email: { $first: '$email' },
                name: { $first: '$name' },
                createdAt: { $first: '$createdAt' },
                updatedAt: { $first: '$updatedAt' },
                services: { $push: '$services' },
                staffUserId: { $first: '$staffUserId' },
            })
            .project({
                _id: 1,
                businessDetails: {
                    _id: 1,
                    businessName: 1,
                    address: 1,
                },
                bookingId: 1,
                note: 1,
                email: 1,
                name: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,
                services: {
                    start: 1,
                    end: 1,
                    appliedOfferType: 1,
                    discountPercentage: 1,
                    discountAmount: 1,
                    amount: 1,
                    serviceName: 1,
                    serviceDetails: 1,
                },
                staffUserId: 1,
            })
            .exec()
        if (result.length > 0) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log(error)
        return { status: false, data: error.message ? error.message : error }
    }
}

bookingDal.businessBookings = async (businessId) => {
    try {
        let result = await bookingSchema
            .aggregate()
            .match({ businessId: ObjectId(businessId) })
            .lookup({
                from: 'businesses',
                localField: 'businessId',
                foreignField: '_id',
                as: 'businessDetails',
            })
            .unwind({ path: '$services', preserveNullAndEmptyArrays: true })
            .lookup({
                from: 'businessservices',
                localField: 'services.serviceId',
                foreignField: '_id',
                as: 'services.serviceDetails',
            })
            .unwind({
                path: '$businessDetails',
                preserveNullAndEmptyArrays: true,
            })
            .unwind({
                path: '$services.serviceDetails',
                preserveNullAndEmptyArrays: true,
            })
            .group({
                _id: '$_id',
                status: { $first: '$status' },
                businessDetails: { $first: '$businessDetails' },
                note: { $first: '$note' },
                bookingId: { $first: '$bookingId' },
                createdAt: { $first: '$createdAt' },
                updatedAt: { $first: '$updatedAt' },
                email: { $first: '$email' },
                name: { $first: '$name' },
                services: { $push: '$services' },
            })
            .project({
                _id: 1,
                businessDetails: {
                    _id: 1,
                    businessName: 1,
                    address: 1,
                },
                note: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,
                bookingId: 1,
                email: 1,
                name: 1,
                services: {
                    start: 1,
                    end: 1,
                    appliedOfferType: 1,
                    discountPercentage: 1,
                    discountAmount: 1,
                    amount: 1,
                    serviceName: 1,
                    serviceDetails: 1,
                },
            })
            .exec()
        if (result.length > 0) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log(error)
        return { status: false, data: error.message ? error.message : error }
    }
}

bookingDal.businessBookingDetailsForTimeRange = async (
    businessId,
    fromDate,
    toDate
) => {
    try {
        let result = await bookingSchema
            .aggregate()
            .match({
                'services.start': {
                    $gte: new Date(fromDate),
                    $lte: new Date(toDate),
                },
                businessId: ObjectId(businessId),
            })
            .lookup({
                from: 'businesses',
                localField: 'businessId',
                foreignField: '_id',
                as: 'businessDetails',
            })
            .lookup({
                from: 'accounts',
                localField: 'bookedById',
                foreignField: '_id',
                as: 'userDetails',
            })
            .unwind({ path: '$services', preserveNullAndEmptyArrays: true })
            .lookup({
                from: 'businessservices',
                localField: 'services.serviceId',
                foreignField: '_id',
                as: 'services.serviceDetails',
            })
            .unwind({
                path: '$businessDetails',
                preserveNullAndEmptyArrays: true,
            })
            .unwind({ path: '$userDetails', preserveNullAndEmptyArrays: true })
            .unwind({
                path: '$services.serviceDetails',
                preserveNullAndEmptyArrays: true,
            })
            // .group({
            //   _id: "$_id",
            //   status: { $first: "$status" },
            //   businessDetails: { $first: "$businessDetails" },
            //   note: { $first: "$note" },
            //   createdAt: { $first: "$createdAt" },
            //   updatedAt: { $first: "$updatedAt" },
            //   bookingId: { $first: "$bookingId" },
            //   userDetails: { $first: "$userDetails" },
            //   services: { $push: "$services" }
            // })
            .sort({ 'services.start': 1 })
            .project({
                _id: 1,
                businessDetails: {
                    _id: 1,
                    businessName: 1,
                    belongTo: 1,
                },
                note: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,
                bookingId: 1,
                email: 1,
                name: 1,
                timezone: 1,
                services: {
                    start: 1,
                    end: 1,
                    appliedOfferType: 1,
                    discountPercentage: 1,
                    discountAmount: 1,
                    amount: 1,
                    serviceName: 1,
                    serviceDetails: 1,
                },
                userDetails: {
                    name: 1,
                    email: 1,
                    phone: 1,
                },
                staffUserId: 1,
                bookedById: 1,
            })
            .exec()
        return { status: true, data: result }
    } catch (error) {
        console.log(error)
        return { status: false, data: error.message ? error.message : error }
    }
}

bookingDal.businessBookingDetailsById = async (id) => {
    try {
        let result = await bookingSchema
            .aggregate()
            .match({ _id: ObjectId(id) })
            .lookup({
                from: 'businesses',
                localField: 'businessId',
                foreignField: '_id',
                as: 'businessDetails',
            })
            .unwind({ path: '$services', preserveNullAndEmptyArrays: true })
            .lookup({
                from: 'businessservices',
                localField: 'services.serviceId',
                foreignField: '_id',
                as: 'services.serviceDetails',
            })
            .unwind({
                path: '$businessDetails',
                preserveNullAndEmptyArrays: true,
            })
            .unwind({
                path: '$services.serviceDetails',
                preserveNullAndEmptyArrays: true,
            })
            .group({
                _id: '$_id',
                status: { $first: '$status' },
                businessDetails: { $first: '$businessDetails' },
                note: { $first: '$note' },
                createdAt: { $first: '$createdAt' },
                updatedAt: { $first: '$updatedAt' },
                bookingId: { $first: '$bookingId' },
                services: { $push: '$services' },
            })
            .project({
                _id: 1,
                businessDetails: {
                    _id: 1,
                    businessName: 1,
                    belongTo: 1,
                },
                note: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,
                bookingId: 1,
                timezone: 1,
                services: {
                    start: 1,
                    end: 1,
                    appliedOfferType: 1,
                    discountPercentage: 1,
                    discountAmount: 1,
                    amount: 1,
                    serviceName: 1,
                    serviceDetails: 1,
                },
            })
            .exec()
        if (result.length > 0) {
            return { status: true, data: result[0] }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log(error)
        return { status: false, data: error.message ? error.message : error }
    }
}

bookingDal.getBookingForParticularDate = async (
    startDateTime,
    endDateTime,
    timezone,
    businessId
) => {
    try {
        let result = await bookingSchema.find({
            'services.start': {
                $gte: startDateTime,
                $lte: endDateTime,
            },
            businessId: businessId,
            status: 'BOOKED',
        })
        let res = []
        for (const booking of result) {
            let services = booking.services
            for (const service of services) {
                res.push({
                    serviceId: service.serviceId,
                    start: new Date(
                        moment
                            .tz(service.start, 'YYYY-MM-DDTHH:mm:ssZ', timezone)
                            .format('YYYY-MM-DDTHH:mm:ssZ')
                    ).getTime(),
                    end: new Date(
                        moment
                            .tz(service.end, 'YYYY-MM-DDTHH:mm:ssZ', timezone)
                            .format('YYYY-MM-DDTHH:mm:ssZ')
                    ).getTime(),
                })
            }
        }
        return res
    } catch (error) {
        console.log(error)
        return { status: false, data: error.message ? error.message : error }
    }
}

bookingDal.deleteAllBookingForUser = async (accountId) => {
    try {
        return bookingSchema.deleteMany({ bookedById: accountId })
    } catch (error) {
        console.log(error)
        return { status: false, data: error.message ? error.message : error }
    }
}

module.exports = bookingDal
