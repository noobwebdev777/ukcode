const express = require("express");
const businessBookingController = require("../controllers/businessBookingController");
const bookingRoute = express.Router();



bookingRoute
.route("/my")
.get(async (req, res) => {
  let result = await businessBookingController.myBookings(req);
  res.status(result.code).send(result);
})

bookingRoute
.route("/upcoming/:businessId")
.get(async (req, res) => {
  let result = await businessBookingController.businessBookingDetailsForNextFifteenDays(req);
  res.status(result.code).send(result);
})

bookingRoute
.route("/:businessId")
.get(async (req, res) => {
  let result = await businessBookingController.businessBookingDetailsForTimeRange(req);
  res.status(result.code).send(result);
})

bookingRoute
.route("/book")
.post(async (req, res) => {
  let result = await businessBookingController.bookService(req);
  res.status(result.code).send(result);
})

bookingRoute
.route("/book/customer")
.post(async (req, res) => {
  let result = await businessBookingController.bookServiceForClient(req);
  res.status(result.code).send(result);
})

bookingRoute
.route("/cancel/:bookingId")
.put(async (req, res) => {
  let result = await businessBookingController.cancelBooking(req);
  res.status(result.code).send(result);
})

bookingRoute
.route("/business/:businessId")
.get(async (req, res) => {
  let result = await businessBookingController.appointmentsForBusiness(req);
  res.status(result.code).send(result);
})


module.exports = bookingRoute;
