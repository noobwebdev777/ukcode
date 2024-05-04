const express = require("express");
const htmlRoute = express.Router();

htmlRoute
  .route("/privacy")
  .get(async (req, res) => {
    res.status(200).send(`<h1 style="color: #5e9ca0; text-align: center;">Privacy policy</h1><p>loem ipsum.</p>`);
  })
htmlRoute
  .route("/about/app")
  .get(async (req, res) => {
    res.status(200).send(`<h1 style="color: #5e9ca0; text-align: center;">About App</h1><p>loem ipsum.</p>`);
  })
htmlRoute
  .route("/terms")
  .get(async (req, res) => {
    res.status(200).send(`<h1 style="color: #5e9ca0; text-align: center;">Terms of services</h1><p>loem ipsum.</p>`);
  })

module.exports = htmlRoute;
