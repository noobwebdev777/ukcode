"use strict";

const FCM = require('fcm-node');
const config = require('../config/config');
let serverKeyCustomerApp = 'AAAAyGR3lcw:APA91bFG7EVtoO1GQm3gkJE9cQ2Kba1o0fk9aeJW9kmD5-VO2TqmOb3UTd-dZZDEhE9yd9htVnFx2TJS_9AYcXNVUQ8q4YCUjURixa8qwaXdgkG8u7qIWUfONKVpOqs0cvZ9jHi4u36J';
let serverKeyBusinessApp = "AAAAiU0-so8:APA91bF3aikW6lWzxdaBfeOswe7H-rfJHUNOUMMFLQpQd3HT--ZDuKB7FaV6N8neG9dgR6z1Y6PcLCn_5fxEC14OwNqQwe63XdBtN0HZTXSR40z5hhXC54EocbAHQSVTCd-Xc67kYPNN";

const sendNotificationCustomer = async function (data) {
  let fcm = new FCM(serverKeyCustomerApp);
  let message = {
    to: data.deviceId, // required fill with device token or topics
    data: {
      businessId: data.businessId
    },
    notification: {
      title: data.businessName || 'Book Mi',
      body: data.message
    }
  };

  fcm.send(message, function (err, response) {
    if (err) {
      console.log(err);
      console.log("Something has gone wrong!");
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
}
const sendNotificationBusiness = async function (data) {
  let fcm = new FCM(serverKeyBusinessApp);
  let message = {
    to: data.deviceId, // required fill with device token or topics
    data: {
      businessId: data.businessId
    },
    notification: {
      title: data.businessName || 'Book Mi',
      body: data.message
    }
  };

  fcm.send(message, function (err, response) {
    if (err) {
      console.log(err);
      console.log("Something has gone wrong!");
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
}

module.exports = {
  sendNotificationCustomer: sendNotificationCustomer,
  sendNotificationBusiness: sendNotificationBusiness
}
