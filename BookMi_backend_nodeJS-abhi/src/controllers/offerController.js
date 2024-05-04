const offerController = {}
const appHelper = require('../helpers/appHelper')
const offerDal = require('../dal/offerDal')
const businessDal = require('../dal/businessDal')

offerController.createOffer = async (req) => {
    try {
        let reqBody = req.body
        let offerType = reqBody.type
        let businessId = reqBody.businessId
        reqBody.createdById = req.user._id
        let checkOffer = await offerDal.findOfferTypeForBusiness(
            businessId,
            offerType
        )
        if (checkOffer.status) {
            return appHelper.apiResponse(
                200,
                false,
                `${offerType} Offer already found for business`,
                `${offerType} Offer already found for business`
            )
        }
        let createOffer = await offerDal.saveOffer(reqBody)
        if (!createOffer.status) {
            return appHelper.apiResponse(
                200,
                false,
                'failed to save offer',
                'failed to save offer'
            )
        }
        return appHelper.apiResponse(200, true, 'success', createOffer.data)
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

offerController.getAllOffer = async (req) => {
    try {
        let getAllOffer = await offerDal.findOffer(req)
        if (!getAllOffer.status) {
            return appHelper.apiResponse(
                200,
                false,
                'failed to get offer',
                'failed to get offer'
            )
        }
        return appHelper.apiResponse(200, true, 'success', getAllOffer.data)
    } catch (error) {
        console.log(' Failed', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

offerController.getOfferDetails = async (req) => {
    try {
        let offerId = req.params.offerId
        let getOfferDetails = await offerDal.findOfferDetails(offerId)
        if (!getOfferDetails.status) {
            return appHelper.apiResponse(
                200,
                false,
                'failed to get offer details',
                'failed to get offer details'
            )
        }
        return appHelper.apiResponse(200, true, 'success', getOfferDetails.data)
    } catch (error) {
        console.log(' Failed', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

offerController.updateOffer = async (req) => {
    try {
        let offerId = req.params.offerId
        let reqBody = req.body
        let updateOffer = await offerDal.findOfferByIdAndUpdate(
            offerId,
            reqBody
        )
        if (!updateOffer.status) {
            return appHelper.apiResponse(
                200,
                false,
                'failed to get offer details',
                'failed to get offer details'
            )
        }
        return appHelper.apiResponse(200, true, 'success', updateOffer.data)
    } catch (error) {
        console.log(' Failed', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

offerController.deleteOffer = async (req) => {
    try {
        let offerId = req.params.offerId
        let deleteOffer = await offerDal.deleteOfferById(offerId)
        if (!deleteOffer.status) {
            return appHelper.apiResponse(
                200,
                false,
                'failed to delete offer',
                'failed to delete offer'
            )
        }
        return appHelper.apiResponse(200, true, 'Offer Deleted')
    } catch (error) {
        console.log(' Failed', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

offerController.applyOffer = async (req) => {
    try {
        console.log('applyOffer body', req.body)
        let businessId = req.body.businessId
        let requestedServices = req.body.services || []
        let readBusiness = await businessDal.findBusinessDetails(businessId)
        if (!readBusiness.status) {
            return appHelper.apiResponse(
                200,
                false,
                'Invalid Business',
                'Invalid Business'
            )
        }
        let businessServices = readBusiness.data.services
        let businessOffers = readBusiness.data.offers
        let res = []
        let totalAmount = 0
        let totalAmountAfterOffer = 0
        let totalDiscountAmount = 0
        for (const requestedService of requestedServices) {
            let serviceId = requestedService.serviceId
            let offerId = requestedService.offerId

            let bookingDate = requestedService.bookingTime
            let serviceDetails = businessServices.find(
                (e) => e._id.toString() === serviceId
            )
            if (!serviceDetails) {
                return appHelper.apiResponse(
                    200,
                    false,
                    'Invalid Service',
                    'Invalid Service'
                )
            }
            console.log('serviceDetails', serviceDetails)
            console.log('offerId', offerId)
            let offerDetails = businessOffers.find(
                (e) => e._id.toString() === offerId
            )
            if (!offerDetails) {
                return appHelper.apiResponse(
                    200,
                    false,
                    'Invalid offer',
                    'Invalid offer'
                )
            }
            let discountPercentage = 0
            let discountType = offerDetails.type
            if (discountType === 'Flash_Sale') {
                discountPercentage = offerDetails.flashSale.discountPercentage
            }
            if (discountType === 'Last_Minute_Discount') {
                discountPercentage =
                    offerDetails.lastMinuteDiscount.discountPercentage
            }
            if (discountType === 'Happy_hours') {
                let happyHours = offerDetails.happyHours || []
                let dayOfWeek = new Date(bookingDate).getDay()
                let happyHourDiscount = happyHours.find(
                    (e) => e.dayOfWeek === dayOfWeek
                )
                if (!happyHourDiscount || !happyHourDiscount.active) {
                    return appHelper.apiResponse(
                        200,
                        false,
                        'Offer is inactive',
                        'Offer is inactive'
                    )
                }
                discountPercentage = happyHourDiscount.discountPercentage
            }
            let offerPrice = discountPercentage
                ? serviceDetails.price -
                  (serviceDetails.price / 100) * discountPercentage
                : serviceDetails.price
            let disAmount = serviceDetails.price - offerPrice
            totalAmountAfterOffer += offerPrice
            totalDiscountAmount += disAmount
            totalAmount += serviceDetails.price
            serviceDetails.offerPrice = Number(
                new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(offerPrice)
            )
            serviceDetails.discountPercentage = discountPercentage
            serviceDetails.offerType = discountType
            serviceDetails.discountAmount = disAmount
            res.push(serviceDetails)
        }
        return appHelper.apiResponse(200, true, 'Offer applied', {
            totalAmount: totalAmount,
            totalAmountAfterOffer: totalAmountAfterOffer,
            totalDiscountAmount: totalDiscountAmount,
            services: res,
        })
    } catch (error) {
        console.log(' Failed', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

module.exports = offerController
