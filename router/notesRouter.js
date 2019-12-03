const notesController = require('../controller/notesController');
const verifyToken = require('../middleware/token');
const express = require('express');
const notesRouter = express.Router();
notesRouter.post('/addNote', verifyToken.userVerify, notesController.addNote);
notesRouter.get('/getNotes', verifyToken.userVerify, notesController.getNotes);
notesRouter.put('/deleteNote', notesController.deleteNote);
notesRouter.put('/editTitle', notesController.editTitle);
notesRouter.put('/editDescription', notesController.editDescription);controller/notesController.js
module.exports = notesRouter;