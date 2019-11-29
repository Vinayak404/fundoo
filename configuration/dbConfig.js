const mongoose = require('mongoose')
connection = () => {
    mongoose.connect(process.env.MONGOURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}
mongoose.connection.on("disconnected", () => {
    console.log("could not connect to Database");
    process.exit();
})
mongoose.connection.on("error", () => {
    console.log("error in connecting to Database");
    process.exit(1);
})