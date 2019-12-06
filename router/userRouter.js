const userController = require('../controller/userController');
const verifyToken = require('../helpers/token')
const express = require('express');
const router = express.Router();
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword', verifyToken.userVerify, userController.resetPassword);
router.post('/uploadpic', verifyToken.userVerify, userController.uploadpic)
module.exports = router;