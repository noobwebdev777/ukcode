const appHelper = require('../helpers/appHelper')
const businessStaffBookingDal = require('../dal/businessStaffBookingDal')
const businessStaffController = require('../controllers/businessStaffController')
const accountControllerV2 = require('../controllers/accountControllerV2')
const bsvController = require('../controllers/businessStaffVacationController')
const Joi = require('joi')
const businessStaffBookingController = {}

businessStaffBookingController.getAvailableStaffs = async (query) => {
    let { businessId, start } = query
    start = typeof start === 'number' ? start : parseInt(start)
    if (businessId === '' || start === 0) {
        return appHelper.apiResponse(400, false, 'bad request', [])
    }
    const response = []
    // get all staffs of business
    const allStaffs =
        await businessStaffController.getAllStaffsOfBusinessInternal(businessId)
    // console.log('allStaffs', allStaffs)
    if (allStaffs === null) {
        return appHelper.apiResponse(200, true, 'no staffs available', [])
    }

    // staff bookings
    const staffBookings = await businessStaffBookingDal.getBookingsOfAllStaffs(
        businessId
    )
    // console.log('>>>staff bookings', staffBookings)

    // filter staffs whose booking does not exist, add these to response
    if (staffBookings.status) {
        // staffs who have never received any bookings
        if (staffBookings.data.length > 0) {
            const staffsWithBookings = staffBookings.data.map((o) => o.userId)
            const freeStaffs = allStaffs.data.filter(
                (o) => staffsWithBookings.findIndex(o.userId) === -1
            )
            // console.log('>>>freeStaffs', freeStaffs)
            response.push(...freeStaffs)
        }

        // when no bookings exists, all staffs are free
        if (staffBookings.data.length === 0) {
            response.push(...allStaffs)
        }
    }

    // staffs whose previous booking is done
    const bookingDoneStaffsUserIds = staffBookings.data
        .filter((o) => o.end <= start)
        .map((o) => o.userId)
    // console.log('>>>bookingDoneStafffs', bookingDoneStaffsUserIds)
    response.push(
        ...allStaffs.filter(
            (o) => bookingDoneStaffsUserIds.indexOf(o.userId) !== -1
        )
    )
    // console.log('>>>response', response)
    let finalResponse = []
    for (const staff of response) {
        const account = await accountControllerV2.getAccountByUserId(
            staff.userId
        )
        // console.log('>>>acct', account)
        if (account.status) {
            finalResponse.push({ ...staff, name: account.data.name })
        }
    }

    // filter staff who are in vacation for the given date
    const vacations = (
        await bsvController.getVacationsOnDate({ businessId, date: start })
    ).data.map((o) => o.userId)
    finalResponse = finalResponse.filter((o) => !vacations.includes(o.userId))

    // respond
    return appHelper.apiResponse(200, true, '', finalResponse)
}

const SaveBookingRequestSchema = Joi.object({
    bookingId: Joi.string().required(),
    businessId: Joi.string().required(),
    userId: Joi.string().required(),
    start: Joi.number().required(),
    end: Joi.number().required(),
})

businessStaffBookingController.saveBooking = async (body) => {
    try {
        const validated = SaveBookingRequestSchema.validate(body)
        if (validated.error) {
            return appHelper.apiResponse(
                400,
                false,
                validated.error.details.map((o) => o.message).join(', '),
                undefined
            )
        }
        const { bookingId, businessId, userId, start, end } = validated.value
        const bsb = {
            bookingId,
            businessId,
            userId,
            start: typeof start === 'number' ? start : parseInt(start),
            end: typeof end === 'number' ? end : parseInt(end),
            createdAt: Date.now(),
        }
        const result = await businessStaffBookingDal.add(bsb)
        console.log('new booking savec', bsb)
        if (result.status) {
            return appHelper.apiResponse(500, false, 'server error', undefined)
        }
        return appHelper.apiResponse(200, true, '', result.data)
    } catch (error) {
        console.log('Failed to save business staff booking', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

const DeleteBookingRequestSchema = Joi.object({
    bookingId: Joi.string().required(),
})

businessStaffBookingController.deleteBooking = async (body) => {
    try {
        const validated = DeleteBookingRequestSchema.validate(body)
        if (validated.error) {
            return appHelper.apiResponse(
                400,
                false,
                validated.error.details.map((o) => o.message).join(', '),
                undefined
            )
        }
        const { bookingId } = validated.value
        const result = await businessStaffBookingDal.delete(bookingId)
        console.log('booking deleted', bookingId, result)
        return appHelper.apiResponse(
            result.status ? 200 : 500,
            result.status,
            '',
            undefined
        )
    } catch (error) {
        console.log('Failed to delete business staff booking', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

module.exports = businessStaffBookingController
