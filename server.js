const express = require('express');
const bodyParser = require('body-parser')
require('dotenv').config()

const routes = require('./router/userRouter')
const expressValidator = require('express-validator')
const dbconnect = require('./configuration/dbConfig')
const app = express();
app.use(expressValidator())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use('/', routes);

//to connect to mongoose database;

app.listen(process.env.PORT, () => {
    console.log(`server is listening on port ${process.env.PORT}`);
    dbconnect.dbConnection()
})