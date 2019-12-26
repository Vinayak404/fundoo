/********************************************************************************************************
 * @Execution : default node : cmd> npm start
 * @Purpose : backend of user login using express node.js for Fundoo app
 * @description :using express framework and connect socket.
 * @overview :API's for backend.
 * @author : Vinayaka.S.V <vinayakavastrad@gmail.com> 
 * @version : 1.0
 * @since : 30/11/2019
 *********************************************************************************************************/
const express = require('express');
const bodyParser = require('body-parser')
require('dotenv').config()
const cors = require('cors')

const routes = require('./router/userRouter')
const notesRoutes = require('./router/notesRouter')
const expressValidator = require('express-validator')
const dbconnect = require('./configuration/dbConfig')
const app = express();
app.use(expressValidator())
app.use(bodyParser.json());
app.use(cors())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use('/user', routes);
app.use('/notes', notesRoutes);

//to connect to server and mongoose database;

app.listen(process.env.PORT, () => {
    console.log(`server is listening on port ${process.env.PORT}`);
    dbconnect.dbConnection()
})
module.exports = app