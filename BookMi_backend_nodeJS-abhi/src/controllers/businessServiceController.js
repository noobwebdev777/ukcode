const businessServiceController = {}
const appHelper = require('../helpers/appHelper')
const businessServiceDal = require('../dal/businessServiceDal')
const businessDal = require('../dal/businessDal')
const bookingDal = require('../dal/bookingDal')
const businessHolidayDal = require('../dal/businessHolidayDal')
const ObjectId = require('mongoose').Types.ObjectId
const moment = require('moment-timezone')

businessServiceController.createBusinessService = async (req) => {
    try {
        let reqBody = req.body
        reqBody.businessId = ObjectId(req.params.businessId)
        reqBody.createdById = req.user._id
        let createBusinessService =
            await businessServiceDal.saveBusinessService(reqBody)
        if (!createBusinessService.status) {
            return appHelper.apiResponse(
                200,
                false,
                'failed to save businessService',
                'failed to save businessService'
            )
        }
        return appHelper.apiResponse(
            200,
            true,
            'success',
            createBusinessService.data
        )
    } catch (error) {
        console.log('login failed with error', error)
        return appHelper.apiResponse(
            500,
            false,
            'failed to login',
            error.message ? error.message : error
        )
    }
}

businessServiceController.createBusinessServiceMany = async (req) => {
    try {
        let reqBody = req.body || []
        let payload = []
        for (const data of reqBody) {
            data.businessId = ObjectId(req.params.businessId)
            data.createdById = req.user._id
            data.price = parseInt(
                data.price
                    .toString()
                    .split('.')[0]
                    .replace(/[^\d\-]+/g, '')
            )
            payload.push(data)
        }
        console.log('saving service - ', JSON.stringify(payload))
        let createBusinessService =
            await businessServiceDal.saveMultipleBusinessService(payload)
        if (!createBusinessService.status) {
            return appHelper.apiResponse(
                200,
                false,
                'failed to save businessService',
                'failed to save businessService'
            )
        }
        return appHelper.apiResponse(
            200,
            true,
            'success',
            createBusinessService.data
        )
    } catch (error) {
        console.log('login failed with error', error)
        return appHelper.apiResponse(
            500,
            false,
            'failed to login',
            error.message ? error.message : error
        )
    }
}

businessServiceController.getBusinessServiceDetails = async (req) => {
    try {
        let businessServiceId = req.params.businessId
        let getBusinessServiceDetails =
            await businessServiceDal.findBusinessServiceDetails(
                businessServiceId
            )
        if (!getBusinessServiceDetails.status) {
            return appHelper.apiResponse(
                200,
                false,
                'failed to get businessService details',
                'failed to get businessService details'
            )
        }
        return appHelper.apiResponse(
            200,
            true,
            'success',
            getBusinessServiceDetails.data
        )
    } catch (error) {
        console.log(' Failed', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

businessServiceController.getServiceDetailsByBusinessMobile = async (req) => {
    let phone = req.query.phone
    const biz = await businessDal.findByPhone('+91' + phone.slice(-10))
    const businessId = biz.data._id
    const categoryWiseServices =
        await businessServiceController.getServiceDetailsBusinessId({
            params: { businessId },
        })
    const res = []
    if (categoryWiseServices.status) {
        for (const category of Object.keys(categoryWiseServices.data)) {
            res.push(...categoryWiseServices.data[category])
        }
    }
    return appHelper.apiResponse(200, res.length > 0, '', res)
}

businessServiceController.getServiceDetailsBusinessId = async (req) => {
    try {
        let businessId = req.params.businessId
        let getBusinessServiceDetails =
            await businessServiceDal.findServiceDetailsBusinessId(businessId)
        if (!getBusinessServiceDetails.status) {
            return appHelper.apiResponse(
                200,
                false,
                'failed to get businessService details',
                []
            )
        }
        let data = getBusinessServiceDetails.data
        let uniqueCategories = [
            ...new Set(data.map((obj) => obj.categoryId?.name)),
        ]
        let res = {}
        for (const categories of uniqueCategories) {
            let tempData = data.filter((e) => e.categoryId?.name === categories)
            if (categories) {
                res[categories] = tempData
            } else {
                res.others = tempData
            }
        }
        return appHelper.apiResponse(200, true, 'success', res)
    } catch (error) {
        console.log(' Failed', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

businessServiceController.updateBusinessService = async (req) => {
    try {
        let businessServiceId = req.params.serviceId
        let reqBody = req.body
        reqBody.updatedById = req.user._id
        let updateBusinessService =
            await businessServiceDal.findBusinessServiceByIdAndUpdate(
                businessServiceId,
                reqBody
            )
        if (!updateBusinessService.status) {
            return appHelper.apiResponse(
                200,
                false,
                'failed to get businessService details',
                'failed to get businessService details'
            )
        }
        return appHelper.apiResponse(
            200,
            true,
            'success',
            updateBusinessService.data
        )
    } catch (error) {
        console.log(' Failed', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

businessServiceController.deleteBusinessService = async (req) => {
    try {
        let businessServiceId = req.params.serviceId
        let deleteBusinessService =
            await businessServiceDal.deleteBusinessServiceById(
                businessServiceId
            )
        if (!deleteBusinessService.status) {
            return appHelper.apiResponse(
                200,
                false,
                'failed to delete businessService',
                'failed to delete businessService'
            )
        }
        return appHelper.apiResponse(200, true, 'Deleted!!')
    } catch (error) {
        console.log(' Failed', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

businessServiceController.getBusinessSlots = async (req) => {
    try {
        let serviceId = ObjectId(req.params.serviceId)
        let businessId = ObjectId(req.params.businessId)
        let date = req.query.date
        let prevServiceEndTime = req.query.endTime
        let timezone = req.query.timezone || 'Asia/Kolkata'
        let currentTimestamp = moment.tz(
            new Date(),
            'YYYY-MM-DD HH:mm:ss',
            timezone
        )
        let currentTime = new Date(currentTimestamp).getTime()
        let getServiceDetails =
            await businessServiceDal.findBusinessServiceDetails(serviceId)
        let getBusinessHoliday =
            await businessHolidayDal.findBusinessHolidayForParticularDate(
                businessId,
                date
            )
        let holidays = getBusinessHoliday.data
        if (!getServiceDetails.status) {
            return appHelper.apiResponse(
                200,
                false,
                'failed to get service details',
                'failed to get service details'
            )
        }
        let day = new Date(date).getDay()
        if (isNaN(day)) {
            return appHelper.apiResponse(
                200,
                false,
                'Invalid date',
                'Invalid date'
            )
        }
        let workingHours =
            getServiceDetails.data.businessId.openHours.find(
                (e) => e.dayOfWeek === day
            ) || {}
        if (!workingHours.openFrom || !workingHours.openTill) {
            return appHelper.apiResponse(
                200,
                false,
                'No Booking available for this date',
                []
            )
        }
        let bookingSlots = []
        let minutes =
            getServiceDetails.data.duration.hours * 60 +
            getServiceDetails.data.duration.minutes
        let x = {
            slotInterval: minutes,
            openTime: workingHours.openFrom,
            closeTime: workingHours.openTill,
        }
        let startDateTime = moment
            .tz(date, 'YYYY-MM-DD HH:mm:ss', timezone)
            .startOf('day')
            .format('YYYY-MM-DD HH:mm:ss')
        let endDateTime = moment
            .tz(date, 'YYYY-MM-DD HH:mm:ss', timezone)
            .endOf('day')
            .format('YYYY-MM-DD HH:mm:ss')
        let bookingsOnDate = await bookingDal.getBookingForParticularDate(
            startDateTime,
            endDateTime,
            timezone,
            businessId
        )
        //Format the time
        let startTime = moment.tz(date, 'YYYY-MM-DD HH:mm:ss', timezone).set({
            h: x.openTime.split(':')[0],
            m: x.openTime.split(':')[1],
        })
        let endTime = moment.tz(date, 'YYYY-MM-DD HH:mm:ss', timezone).set({
            h: x.closeTime.split(':')[0],
            m: x.closeTime.split(':')[1],
        })

        if (prevServiceEndTime) {
            startTime = moment.tz(date, 'YYYY-MM-DD HH:mm:ss', timezone).set({
                h: prevServiceEndTime.split(':')[0],
                m: prevServiceEndTime.split(':')[1],
            })
        }
        while (startTime < endTime) {
            //Push times
            if (new Date(startTime).getTime() > currentTime) {
                let checkBlockSlot = await holidays.find(
                    (e) =>
                        new Date(startTime).getTime() >=
                            new Date(e.from).getTime() &&
                        new Date(startTime).getTime() < new Date(e.to).getTime()
                )
                let slotCheck = await bookingsOnDate.find(
                    (e) =>
                        e.start <= new Date(startTime).getTime() &&
                        e.end > new Date(startTime).getTime()
                )
                if (!slotCheck) {
                    bookingSlots.push({
                        blocked: checkBlockSlot ? true : false,
                        slotTime: startTime.format('LT'),
                    })
                }
            }
            //Add interval of 30 minutes
            startTime.add(x.slotInterval, 'minutes')
        }
        if (bookingSlots.length === 0) {
            return appHelper.apiResponse(
                200,
                false,
                'Booking closed',
                bookingSlots
            )
        }
        return appHelper.apiResponse(200, true, 'success', bookingSlots)
    } catch (error) {
        console.log('login failed with error', error)
        return appHelper.apiResponse(
            500,
            false,
            'failed to login',
            error.message ? error.message : error
        )
    }
}

module.exports = businessServiceController
