const userController = require('../controller/userController')
const verifyToken = require('../middleware/token')
const express = require('express');
const router = express.Router();
router.post('/user/register', userController.register);
router.post('/user/login', userController.login);
router.post('/user/forgotPassword', userController.forgotPassword);
router.post('/user/resetPassword/:token', verifyToken.verify, userController.resetPassword);
module.exports = router;