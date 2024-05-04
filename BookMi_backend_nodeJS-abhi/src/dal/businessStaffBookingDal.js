const schema = require('../models/businessStaffBooking')
const businessStaffBookingDal = {}

businessStaffBookingDal.add = async (data) => {
    const { userId, businessId } = data
    const existing = await businessStaffBookingDal.getSingle(businessId, userId)
    if (existing.status) {
        // update
        if ('_id' in existing.data) {
            return businessStaffBookingDal.update(existing.data._id, data)
        }
    }
    // create new
    return businessStaffBookingDal.addNew(data)
}

businessStaffBookingDal.getSingle = async (businessId, userId) => {
    try {
        const result = await schema.findOne({ businessId, userId })
        if (result) {
            return { status: true, data: result }
        }
        return {
            status: false,
            data: result,
            message: 'Failed to get single business staff',
        }
    } catch (error) {
        console.log('failed to fetch business staff booking', error)
        return { status: false, data: error.message ? error.message : error }
    }
}

businessStaffBookingDal.addNew = async (data) => {
    try {
        const bs = new schema(data)
        const result = await bs.save()
        if (result) {
            return { status: true, data: result }
        }
        return {
            status: false,
            data: result,
            message: 'Failed to add new biz staff booking',
        }
    } catch (error) {
        if (error.code == '11000') {
            return {
                status: false,
                message: `${Object.keys(error.keyValue)[0]} is already taken`,
            }
        } else {
            return {
                status: false,
                message: error.message ? error.message : error,
            }
        }
    }
}

businessStaffBookingDal.update = async (id, data) => {
    try {
        let result = await schema.findByIdAndUpdate(id, data, {
            new: true,
        })
        return {
            status: result ? true : false,
            data: result,
        }
    } catch (error) {
        console.log('failed to save Users', error)
        return { status: false, data: error.message ? error.message : error }
    }
}

businessStaffBookingDal.getBookingsOfAllStaffs = async (businessId) => {
    try {
        const result = await schema.find({ businessId })
        return {
            status: result ? true : false,
            data: result,
        }
        return {
            status: false,
            data: result,
            message: 'Failed to get bookings of all staffs',
        }
    } catch (error) {
        if (error.code == '11000') {
            return {
                status: false,
                message: `${Object.keys(error.keyValue)[0]} is already taken`,
            }
        } else {
            return {
                status: false,
                message: error.message ? error.message : error,
            }
        }
    }
}

businessStaffBookingDal.delete = async (bookingId) => {
    try {
        const result = await schema.deleteOne({
            bookingId,
        })
        return {
            status: result ? true : false,
            data: result,
        }
    } catch (error) {
        if (error.code == '11000') {
            return {
                status: false,
                message: `${Object.keys(error.keyValue)[0]} is already taken`,
            }
        } else {
            return {
                status: false,
                message: error.message ? error.message : error,
            }
        }
    }
}

module.exports = businessStaffBookingDal
