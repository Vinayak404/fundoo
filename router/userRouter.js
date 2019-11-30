const userController = require('../controller/userController')
const verifyToken = require('../middleware/token')
const express = require('express');
const router = express.Router();
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword', verifyToken.verify, userController.resetPassword);
module.exports = router