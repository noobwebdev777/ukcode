// Reef: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/ses-examples-sending-email.html
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')
const config = require('../config/config')

const client = new SESClient({
    region: config.aws.region,
    credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
    },
})

class SesService {
    constructor() {}
    async sendEmail(email, fromEmail, subject, message) {
        const cmd = new SendEmailCommand({
            Destination: {
                /* required */
                ToAddresses: [email /* more items */],
            },
            Message: {
                /* required */
                Body: {
                    /* required */
                    Text: {
                        Charset: 'UTF-8',
                        Data: message,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject,
                },
            },
            Source: fromEmail,
            /* required */
            ReplyToAddresses: [fromEmail /* more items */],
        })

        try {
            return client.send(cmd)
        } catch (e) {
            console.log('failed to send email through ses', e)
        }
        return null
    }
}

module.exports = new SesService()
