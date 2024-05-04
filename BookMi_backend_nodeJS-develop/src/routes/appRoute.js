const express = require("express");
const defaultRoute = require('./defaultRoute');
const accountRoute = require("./accountRoute");
const categoryRoute = require("./categoryRoute");
const fileUploadRoute = require("./fileUploadRoute");
const businessRoute = require("./businessRoute");
const bookingRoute = require("./bookingRoute");
const offersRoute = require("./offersRoute");
const htmlRoute = require("./htmlRoute");
const path = require('path');
const appRoute = express.Router();

appRoute.initialize = (app) => {
  app.use('/', defaultRoute);
  app.use('/pages', htmlRoute);
  app.use('/password_reset', (req, res) => {
    res.sendFile(path.join(__dirname+'/../views/resetPassword.html'));
  });
  app.use("/account", accountRoute);
  app.use("/category", categoryRoute);
  app.use("/file", fileUploadRoute);
  app.use("/business", businessRoute);
  app.use("/appointment", bookingRoute);
  app.use("/offer", offersRoute);
};

module.exports = appRoute;
