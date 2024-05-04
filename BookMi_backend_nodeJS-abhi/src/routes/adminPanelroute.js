const express = require('express')
const bizController = require('../controllers/businessController')
const businessBookingController = require('../controllers/businessBookingController')
const adminPanelRoute = express.Router()

adminPanelRoute.route('/biz/all').get(async (req, res) => {
    let result = await bizController.getAllBusinessForAdminPortal(req)
    res.status(result.code).send(result)
})

adminPanelRoute.route('/biz/bookings').get(async (req, res) => {
    let result = await businessBookingController.appointmentsForBusiness(req)
    res.status(result.code).send(result)
})

adminPanelRoute.route('/biz/bookings/date').get(async (req, res) => {
    let result =
        await businessBookingController.businessBookingDetailsForTimeRange(req)
    res.status(result.code).send(result)
})

adminPanelRoute.route('/biz/bookings/upcoming').get(async (req, res) => {
    let result =
        await businessBookingController.businessBookingDetailsForNextFifteenDays(
            req
        )
    res.status(result.code).send(result)
})

module.exports = adminPanelRoute
