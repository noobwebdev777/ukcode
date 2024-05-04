let config = new Object();

config = {
  app: {
    port: process.env.APP_PORT || 3000,
    // database: process.env.MONGODB_URL || 'mongodb://localhost:27017/book_mi',
    database: process.env.MONGODB_URL || 'mongodb://localhost:8000/book_mi',
    backendUrl: process.env.BACKEND_URL || 'http://localhost:3000/',
    uiUrl: process.env.UI_URL
  },
  mail: {
    from: process.env.MAIL_FROM,
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
    mailPort: process.env.MAIL_PORT || 587,
    smtp: process.env.MAIL_SMTP
  },
  razorPay: {
    razorPayKey: process.env.RAZOR_PAY_API_KEY,
    razorPaySecret: process.env.RAZOR_PAY_SECRET,

  }
};

module.exports = config;