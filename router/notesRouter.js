const notesController = require('../controller/notesController')
const verifyToken = require('../middleware/token')
const express = require('express');
const notesRouter = express.Router();
notesRouter.post('/notes/addNote', notesController.addNote);
// router.post('/user/login', userController.login);
// router.post('/user/forgotPassword', userController.forgotPassword);
// router.post('/user/resetPassword/:token', verifyToken.verify, userController.resetPassword);
module.exports = notesRouter;