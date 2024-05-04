const express = require('express')
const businessStaffController = require('../controllers/businessStaffController')
const businessStaffRoute = express.Router()

businessStaffRoute.route('/add').post(async (req, res) => {
    const result = await businessStaffController.add(req)
    res.status(result.code).send(result)
})

businessStaffRoute.route('/all').get(async (req, res) => {
    const result = await businessStaffController.getAllStaffsOfBusiness(req.query)
    res.status(result.code).send(result)
})

businessStaffRoute.route('/delete').post(async (req, res) => {
    const result = await businessStaffController.delete(req.body)
    res.status(result.code).send(result)
})

module.exports = businessStaffRoute
