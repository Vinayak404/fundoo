const winston = require('winston')
let logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'Logging_Mongo'
        })
    ]
})
let ExpressServerLogger = winston.createLogger({
    transports: [
        new winston.transports.Console(), new winston.transports.File({
            filename: 'Logging_Express'
        })
    ]
})
module.exports = {
    logger,
    ExpressServerLogger
}