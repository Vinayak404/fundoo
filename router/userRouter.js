/********************************************************************************************************
 * @Execution : default node : cmd> npm start
 * @Purpose : backend of user login using express node.js for Fundoo app
 * @description :using express framework and connect socket.
 * @overview :API's for backend.
 * @author : Vinayaka.S.V <vinayakavastrad@gmail.com> 
 * @version : 1.0
 * @since : 30/11/2019
 *********************************************************************************************************/
const userController = require('../controller/userController');
const verifyToken = require('../helpers/token')
const express = require('express');
const router = express.Router();
const upload = require('../helpers/multer');
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword', verifyToken.userVerify, userController.resetPassword);
router.post('/uploadpic', verifyToken.userVerify, upload.single('image'), userController.uploadpic)
module.exports = router;