const express = require('express')
const bsvController = require('../controllers/businessStaffVacationController')
const businessStaffVacationRoute = express.Router()

businessStaffVacationRoute.route('/add').post(async (req, res) => {
    const result = await bsvController.add(req.body)
    res.status(result.code).send(result)
})

businessStaffVacationRoute.route('/add/eod').post(async (req, res) => {
    const result = await bsvController.addEod(req.body)
    res.status(result.code).send(result)
})

businessStaffVacationRoute.route('/staff').get(async (req, res) => {
    const result = await bsvController.getVacationOfStaff(req.query)
    res.status(result.code).send(result)
})

businessStaffVacationRoute.route('/date').get(async (req, res) => {
    const result = await bsvController.getVacationsOnDate(req.query)
    res.status(result.code).send(result)
})

businessStaffVacationRoute.route('/delete').post(async (req, res) => {
    const result = await bsvController.deleteVacation(req.body)
    res.status(result.code).send(result)
})

module.exports = businessStaffVacationRoute
