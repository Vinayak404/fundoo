const notesController = require('../controller/notesController')
const verifyToken = require('../middleware/token')
const express = require('express');
const notesRouter = express.Router();
notesRouter.post('/notes/addNote', verifyToken.userVerify, notesController.addNote);
module.exports = notesRouter;