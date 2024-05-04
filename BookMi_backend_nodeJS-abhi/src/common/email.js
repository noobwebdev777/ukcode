const config = require('../config/config')
const sesService = require('./ses-service')

const sendEmail = async (to, subject, message, from) => {
    console.log(`sending email to: ${to}, message: ${message}`)
    if (config.env === 'prod') {
        await sesService.sendEmail({
            to,
            from: from ?? config.emailFrom,
            subject,
            message,
        })
    }
}

module.exports = sendEmail
