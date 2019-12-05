const mongoose = require('mongoose')
require('dotenv').config();

exports.dbConnection = () => {
    mongoose.connect(process.env.MONGOURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}
mongoose.connection.on("connected", () => {
    console.log("Successfully connected to database");
})
mongoose.connection.on("disconnected", () => {
    console.log("could not connect to Database");
    process.exit();
})
mongoose.connection.on("error", () => {
    console.log("error in connecting to Database");
    process.exit(1);
})