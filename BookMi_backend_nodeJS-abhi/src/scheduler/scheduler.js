const Agenda = require('agenda');
const config = require('../config/config');
const pushNotification = require("../notification/pushNotification");
const bookingDal = require('../dal/bookingDal')
const agenda = new Agenda({ db: { address: config.app.database, options: { useNewUrlParser: true, useUnifiedTopology: true } } });

agenda.define('booking_notification', async function (booking) {
  let data = booking.attrs.data;
  let customerNotificationData = data.customerNotificationData
  let businessNotificationData = data.businessNotificationData
  customerNotificationData.message = customerNotificationData.snMessage
  businessNotificationData.message = businessNotificationData.snMessage;
  if (customerNotificationData.deviceId) {
    await pushNotification.sendNotificationCustomer(customerNotificationData)
  }
  if (businessNotificationData.deviceId) {
    await pushNotification.sendNotificationBusiness(businessNotificationData)
  }
});


agenda.define('booking_finished_update', async function (booking) {
  let data = booking.attrs.data;
  let bookingId = data.bookingId;
  await bookingDal.finishedBookingByBookingId(bookingId)
});


module.exports = agenda;
