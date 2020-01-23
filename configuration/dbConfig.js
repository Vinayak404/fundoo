const mongoose = require('mongoose')
require('dotenv').config();
const logger = require('../helpers/logger')

exports.dbConnection = () => {
    mongoose.connect(process.env.MONGOURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}
mongoose.connection.on("connected", () => {
    logger.logger.info("Successfully connected to database");
})
mongoose.connection.on("disconnected", () => {
    logger.logger.warn("disconnected from Database");
    process.exit();
})
mongoose.connection.on("error", () => {
    logger.logger.error("error in connecting to Database");
    process.exit(1);
})