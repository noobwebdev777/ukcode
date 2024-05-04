const businessBookingController = new Object();
const config = require('../config/config');
const appHelper = require("../helpers/appHelper");
const bookingDal = require("../dal/bookingDal");
const deviceDal = require("../dal/deviceDal");
const Scheduler = require("../scheduler/scheduler")
const emailNotification = require("../notification/emailNotification");
const pushNotification = require("../notification/pushNotification");
const e = require('express');
const ObjectId = require('mongoose').Types.ObjectId;
const moment = require('moment-timezone');

businessBookingController.bookService = async (req) => {
  try {
    let reqBody = req.body;
    reqBody.bookedById = req.user._id;
    let createBooking = await bookingDal.saveBooking(reqBody)
    if (!createBooking.status) {
      return appHelper.apiResponse(200, false, "Booking Failed!!", createBooking.data);
    }
    let bookingId = createBooking.data._id
    let getData = await bookingDal.businessBookingDetailsById(bookingId)
    let businessId = getData.data.businessDetails._id;
    let bookedTime = getData.data.services[0].start;
    let bookedEndTime = getData.data.services[getData.data.services.length - 1].end;
    let timezone = getData.data.timezone || 'Asia/Kolkata';;
    // let bookedTimeWithTimeZone = moment.tz(bookedTime, 'YYYY-MM-DD HH:mm:ss', timezone).format();
    // let date = new Date(bookedTimeWithTimeZone).toDateString();
    // let time = moment(new Date(bookedTimeWithTimeZone)).format('hh:mm a')


    let bookedTimeWithTimeZone = moment(bookedTime).tz(timezone);
    let time = moment(bookedTimeWithTimeZone).format('llll')

    let businessName = getData.data.businessDetails.businessName;
    let businessOwnerId = getData.data.businessDetails.belongTo;
    let bookedMessage = `Your appointment with ${businessName} on ${time} has been confirmed`
    let ownerMessage = `New appointment on ${time} has been booked`;
    Scheduler.schedule(bookedEndTime, 'booking_finished_update', {
      bookingId: bookingId
    });
    let getDeviceIds = await deviceDal.getDeviceForUser(req.user._id)
    let ownerDeviceId = await deviceDal.getDeviceForUser(businessOwnerId);
    let customerNotificationData = {
      message: bookedMessage,
      deviceType: getDeviceIds.data.deviceType,
      deviceId: getDeviceIds.data.deviceId,
      businessId: businessId,
      businessName: businessName,
      snMessage: `Reminder for your appointment with ${businessName} on ${time}`
    }
    let businessNotificationData = {
      message: ownerMessage,
      deviceType: ownerDeviceId.data.deviceType,
      deviceId: ownerDeviceId.data.deviceId,
      businessId: businessId,
      businessName: businessName,
      snMessage: `Reminder for your appointment on ${time}`
    }
    if (req.user.emailNotification) {
      emailNotification.confirmBooking(getData.data, req.user)
    }
    if (req.user.pushNotification) {
      if (getDeviceIds.status) {
        pushNotification.sendNotificationCustomer(customerNotificationData)
      }
      if (ownerDeviceId.status) {
        pushNotification.sendNotificationBusiness(businessNotificationData)
      }
    }
    let timestamp = new Date(bookedTime).getTime()
    let oneHrBeforeTime = new Date(timestamp - 1000 * 60 * 60)
    let fourHrBeforeTime = new Date(timestamp - 4000 * 60 * 60)
    if (oneHrBeforeTime > Date.now() && req.user.pushNotification) {
      await Scheduler.schedule(oneHrBeforeTime, 'booking_notification', {
        bookingId: bookingId,
        bookedTime: bookedTime,
        timezone: timezone,
        customerNotificationData: customerNotificationData,
        businessNotificationData: businessNotificationData
      });
    }
    if (fourHrBeforeTime > Date.now() && req.user.pushNotification) {
      await Scheduler.schedule(fourHrBeforeTime, 'booking_notification', {
        bookingId: bookingId,
        bookedTime: bookedTime,
        timezone: timezone,
        customerNotificationData: customerNotificationData,
        businessNotificationData: businessNotificationData
      });
    }
    // Scheduler.schedule(bookedEndTime, 'booking_finished_update', {
    //   bookingId: bookingId
    // });
    return appHelper.apiResponse(200, true, "success", getData.data);
  }
  catch (error) {
    console.log("Booking failed with error", error);
    return appHelper.apiResponse(500, false, "failed to login", error.message ? error.message : error);
  }
};

businessBookingController.bookServiceForClient = async (req) => {
  try {
    let reqBody = req.body;
    let createBooking = await bookingDal.saveBooking(reqBody)
    if (!createBooking.status) {
      return appHelper.apiResponse(200, false, "Booking Failed!!", createBooking.data);
    }
    let bookingId = createBooking.data._id
    let getData = await bookingDal.businessBookingDetailsById(bookingId);
    if (reqBody.email) {
      emailNotification.confirmBooking(getData.data, { email: reqBody.email })
    }
    return appHelper.apiResponse(200, true, "success", getData.data);
  }
  catch (error) {
    console.log("login failed with error", error);
    return appHelper.apiResponse(500, false, "failed to login", error.message ? error.message : error);
  }
};

businessBookingController.cancelBooking = async (req) => {
  try {
    let bookingId = req.params.bookingId
    let cancelBooking = await bookingDal.cancelBookingByBookingId(bookingId)
    if (!cancelBooking.status) {
      return appHelper.apiResponse(200, false, "Appointment cancellation failed", cancelBooking.data);
    }
    await Scheduler.cancel({ "data.bookingId": ObjectId(bookingId), lastRunAt: { '$exists': false } });
    return appHelper.apiResponse(200, true, "Appointment canceled", cancelBooking.data);
  } catch (error) {
    console.log(" Failed", error);
    return appHelper.apiResponse(500, false, error.message ? error.message : "internal server error");
  }
};


businessBookingController.myBookings = async (req) => {
  try {
    let bookedById = req.user._id;
    let myBookings = await bookingDal.getMyBookingData(bookedById)
    if (!myBookings.status) {
      return appHelper.apiResponse(200, false, "failed to get appointment", myBookings.data);
    }
    let oldBookings = []
    let upcomingBookings = []
    let data = myBookings.data
    for (const booking of data) {
      let upcomingBooking = false
      for (const service of booking.services) {
        if (service.start?.getTime() > new Date().getTime()) {
          upcomingBooking = true
        }
      }
      if (upcomingBooking) {
        upcomingBookings.push(booking)
      } else {
        oldBookings.push(booking)
      }
    }
    return appHelper.apiResponse(200, true, "success", { expiredBooking: oldBookings, upcomingBooking: upcomingBookings });
  } catch (error) {
    console.log(" Failed", error);
    return appHelper.apiResponse(500, false, error.message ? error.message : "internal server error");
  }
};

businessBookingController.appointmentsForBusiness = async (req) => {
  try {
    let businessId = req.params.businessId;
    let bookings = await bookingDal.businessBookings(businessId)
    if (!bookings.status) {
      return appHelper.apiResponse(200, false, "failed to get appointment", bookings.data);
    }
    return appHelper.apiResponse(200, true, "success", bookings.data);
  } catch (error) {
    console.log(" Failed", error);
    return appHelper.apiResponse(500, false, error.message ? error.message : "internal server error");
  }
};

businessBookingController.businessBookingDetailsForTimeRange = async (req) => {
  try {
    let businessId = req.params.businessId;
    let ownerId = req.user._id;
    let date = req.query.date;
    if (!date) {
      return appHelper.apiResponse(200, false, "date is required", {});
    }
    let startDateTime = moment(date, 'YYYY-MM-DD HH:mm:ss').startOf('day').format('YYYY-MM-DD HH:mm:ss');
    let endDateTime = moment(date, 'YYYY-MM-DD HH:mm:ss').endOf('day').format('YYYY-MM-DD HH:mm:ss');
    let bookings = await bookingDal.businessBookingDetailsForTimeRange(businessId,  startDateTime, endDateTime)
    if (!bookings.status) {
      return appHelper.apiResponse(200, false, "failed to get appointment", bookings.data);
    }
    return appHelper.apiResponse(200, true, "success", bookings.data);
  } catch (error) {
    console.log(" Failed", error);
    return appHelper.apiResponse(500, false, error.message ? error.message : "internal server error");
  }
};


businessBookingController.businessBookingDetailsForNextFifteenDays = async (req) => {
  try {
    let businessId = req.params.businessId;
    let today = new Date()
    let a = moment(today);
    let b = moment(today.setDate(today.getDate() + 29));
    let res = []
    for (var m = moment(a); m.isBefore(b); m.add(1, 'days')) {
      let date = m.format('YYYY-MM-DD');
      if (!date) {
        return appHelper.apiResponse(200, false, "date is required", {});
      }
      let startDateTime = moment(date, 'YYYY-MM-DD HH:mm:ss').startOf('day').format('YYYY-MM-DD HH:mm:ss');
      let endDateTime = moment(date, 'YYYY-MM-DD HH:mm:ss').endOf('day').format('YYYY-MM-DD HH:mm:ss');
      let bookings = await bookingDal.businessBookingDetailsForTimeRange(businessId, startDateTime, endDateTime)
      if (!bookings.status) {
        return appHelper.apiResponse(200, false, "failed to get appointment", bookings.data);
      }
      let payload  = {
        date: date,
        appointments: bookings.data
      }
      res.push(payload)
    }
    return appHelper.apiResponse(200, true, "success", res);
  } catch (error) {
    console.log(" Failed", error);
    return appHelper.apiResponse(500, false, error.message ? error.message : "internal server error");
  }
};


module.exports = businessBookingController;
