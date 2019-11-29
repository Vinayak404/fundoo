const express = require('express');
const userController = require('../controller/userController')
router = express.Router();
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword', userController.resetPassword);
module.exports = router