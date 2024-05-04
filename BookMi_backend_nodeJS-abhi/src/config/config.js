let config = {}

config = {
    env: process.env.ENV || 'dev',
    name: 'bookmi',
    jwtSecret: process.env.JWT_SECRET,
    otpTTLInSeconds: 300,
    otpRateLimit: 5,
    emailFrom: process.env.EMAIL_FROM,
    smsTemplates: {
        otp: {
            templateId: '1207160598956611412',
            message: 'account: %s is your SubNub account verification code.',
        },
    },
    app: {
        host: '0.0.0.0',
        port: process.env.APP_PORT || 3000,
        // database: process.env.MONGODB_URL || 'mongodb://localhost:27017/book_mi',
        database:
            process.env.MONGODB_URL || 'mongodb://localhost:27017/book_mi',
        backendUrl: process.env.BACKEND_URL || 'http://localhost:3000/',
        redis: process.env.REDIS_URL || 'redis://localhost',
    },
    mail: {
        from: process.env.MAIL_FROM,
        username: process.env.MAIL_USERNAME,
        password: process.env.MAIL_PASSWORD,
        mailPort: process.env.MAIL_PORT || 587,
        smtp: process.env.MAIL_SMTP,
    },
    razorPay: {
        razorPayKey: process.env.RAZOR_PAY_API_KEY,
        razorPaySecret: process.env.RAZOR_PAY_SECRET,
    },
    aws: {
        accessKeyId: process.env.AWS_KEY_ID,
        secretAccessKey: process.env.AWS_KEY_SECRET,
        region: process.env.AWS_REGION,
    },
    distanceForBusinessDiscover: 30000,
}

module.exports = config
