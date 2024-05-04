const email = new Object();
const config = require('../config/config');
const nodemailer = require("nodemailer");
const mailTemplate = require('../misc/mailTemplates');
const shortUrl = require("node-url-shortener");
let transporter = nodemailer.createTransport({
  host: config.mail.smtp,
  port: config.mail.mailPort,
  secure: false,
  auth: {
    user: config.mail.username,
    pass: config.mail.password,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  }
});

email.forgotPasswordEmail = async (reqBody) => {
  let url = `${config.app.backendUrl}password_reset?accountId=${reqBody.accountId}&token=${reqBody.token}`;
  // shortUrl.short(url, async (err, url) => {
    let body = await mailTemplate.forgotPasswordTemplate(url)
    let sendEmail = await transporter.sendMail({
      from: `"BookMi" <${config.mail.from}>`,
      to: reqBody.to,
      subject: "Changing your BookMi password",
      html: body,
      text: body,
    });
    console.log(sendEmail);
    return
  // });
}


email.confirmBooking = async (data, userDetails) => {
  // let url = `${config.app.backendUrl}password_reset/${reqBody.accountId}/${reqBody.token}/`;
  // shortUrl.short(url, async (err, url) => {
  let body = await mailTemplate.bookingTemplate(data, userDetails)
  let sendEmail = await transporter.sendMail({
    from: `"${data.businessDetails.businessName}" <${config.mail.from}>`,
    to: userDetails.email,
    subject: "Your booking has been confirmed",
    html: body
  });
  console.log(body);
  return
}


module.exports = email;
