const mongoose = require('mongoose')
const config = require('../config/config')
const retryIntervalInMS = 5000
const database = {}
const options = {
    useNewUrlParser: true,
    autoIndex: true,
    keepAlive: true,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    useUnifiedTopology: true,
    retryWrites: false,
}

database.establishConnection = async () => {
    const dbUrl = config.app.database
    console.log('MongoDB connection initiated')

    await mongoose
        .connect(dbUrl, options)
        .then(() => {
            console.log('MongoDB connected successfully')
        })
        .catch((err) => {
            console.log(err.message ? err.message : 'Mongodb connection error')
            // console.log("MongoDB Connection Failed, retrying in " + retryIntervalInMS + " ms");
            process.exit(0)
            // setTimeout(database.establishConnection, retryIntervalInMS);
        })
}

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose connection closed successfully')
        process.exit(0)
    })
})

module.exports = database
