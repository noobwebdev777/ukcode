const express = require("express");
const defaultRoute = express.Router();

defaultRoute.route("/").get(async (req, res) => {
  return res.status(200).send({
    status: true,
    message: "Hurray! BookMi backend service is running successfully"
  });
});

module.exports = defaultRoute;