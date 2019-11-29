const express = require('express');
const routes = require('./router/userRouter')
const expressValidator = require('express-validator')
const bodyParser = require('body-parser')
require('dotenv').config()
const app = express();
app.use('/', routes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(expressValidator())
//to connect to mongoose database;

app.listen(process.env.PORT, () => {
    console.log(`server is listening on port ${process.env.PORT}`);
    db.connect.connection()
})